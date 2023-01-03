import "./Card.css";

export function Card({ props, action, type }) {
  if (type == "input")
    return (
      <div className="card-container">
        <h2>{props.functionName}</h2>
        <input type="text" className="card-input" placeholder="Usage: param1,param2..."/>
        <button type="submit" onClick={action} className="card-button">Enviar</button>
      </div>
    );
  else
    return (
      <div className="card-container" onClick={action}>
        <h2>{props.functionName}</h2>
      </div>
    );
}
