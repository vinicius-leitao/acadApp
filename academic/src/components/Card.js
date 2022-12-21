import '../styles/Card.css';

export function Card ({props}){
    return (
        <div className="card-container">
            <h2>{props.functionName}</h2>
            <input type="text"/>
        </div>
    )
}