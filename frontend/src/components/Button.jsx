const Button = (props) => {
    const classes = () => {
        const color = props.btncolor ? ' btn-' + props.btncolor : ' ';
        const icon = props.btnicon ? ' btn-' + props.btnicon : ' ';
        return `btn ${color} ${icon}`;
    }
    return (
        <button className={classes()} type={props.btntype} {...props}>{props.btntext}</button>
    );
}

export default Button;