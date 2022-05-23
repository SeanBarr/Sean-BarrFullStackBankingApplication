const Card = (props) => {
    const classes = () => {
        const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
        const txt = props.txtcolor ? ' text-' + props.txtcolor : 'text-white';
        return `card card-md m-auto ${bg} ${txt}`;
    }
    return (
        <div className={classes()}>
            <h1 className="card-header fs-5">{props.header}</h1>
            <div className="card-body">
                {props.title && (<h2 className="card-title">{props.title}</h2>)}
                {props.text && (<p className="card-text">{props.text}</p>)}
                {props.body}
            </div>
        </div>
    );
}

export default Card;