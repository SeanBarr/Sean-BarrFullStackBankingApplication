const Account = require('../schemas/accountSchema');

const getAccounts = async (request, response) => {
    const owner = request.params.owner;
    const accounts = await Account.find({ owner })
    if (!accounts) return response.status(404).json({ message: "You currently have no accounts." });
    const modifiedAccounts = accounts.map(account => { return { id: account._id, type: account.type, number: account.number, balance: account.balance } })
    response.status(200)
    response.json({
        accounts: modifiedAccounts
    });
}

const createAccount = async (request, response) => {
    const type = request.body.type;
    const owner = request.params.owner
    let generatedRundomNumber
    let isUnique = false;
    const generateRundomNumber = async () => {
        generatedRundomNumber = Math.floor(1000000000000 + Math.random() * 9000000000000)
        isUnique = await Account.findOne({ number: generatedRundomNumber }) ? false : true;
        if (!generatedRundomNumber || !isUnique) generateRundomNumber();
    }
    generateRundomNumber();
    const newAccount = await Account.create({
        owner: owner,
        type: type,
        number: generatedRundomNumber,
    })
    response.status(201)
    response.json({
        account:
        {
            id: newAccount._id,
            type: newAccount.type,
            number: newAccount.number,
            balance: newAccount.balance
        }
    })
}

const updateAccount = async (request, response) => {
    const { number, amount, action } = request.body;
    if (!number || !amount || !action) {
        response.status(400)
        throw new Error("Please provide all the required fields.");
    }
    const account = await Account.findOne({ number });
    if (!account) {
        response.status(404)
        throw new Error("Account not found.")
    }
    if (action === "deposit") {
        account.balance += amount;
    }
    else if (action === "withdraw") {
        if (account.balance < amount) {
            response.status(400)
            throw new Error("Insufficient funds.")
        }
        if (account.type === "savings") {
            response.status(400)
            throw new Error("Cannot withdraw from savings account.")
        }
        account.balance -= amount;
    }
    await account.save();
    response.status(200)
    response.json({
        account:
        {
            id: account._id,
            type: account.type,
            number: account.number,
            balance: account.balance
        }
    });
}

const deleteAccount = async (request, response) => {
    const { number } = request.body;
    await Account.deleteOne({ number });
    response.status(200).json({ message: "Account deleted successfully." });
}


module.exports = {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
}