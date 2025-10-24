function RequestCard({ request, onEdit, onDelete }) {
    return (
      <div className="request-card">
        <h3>{request.name}</h3>
        <p>Description: {request.description}</p>
        <p>Location: {request.location}</p>
        <p>File: {request.file || 'None'}</p>
        <button className="edit" onClick={() => onEdit(request)}>Edit</button>
        <button className="delete" onClick={() => onDelete(request.id)}>Delete</button>
      </div>
    );
  }
  
  export default RequestCard;