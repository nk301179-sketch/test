import RequestCard from './RequestCard';

function RequestList({ requests, onEdit, onDelete }) {
  return (
    <div className="request-list">
      {requests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default RequestList;