import RequestCard from './RequestCard';

function RequestList({ surrenderDogs, onEdit, onDelete }) {
  return (
    <div className="request-list">
      {surrenderDogs.map(surrenderDog => (
        <RequestCard
          key={surrenderDog.surrenderId}
          surrenderDog={surrenderDog}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default RequestList;