function RequestCard({ surrenderDog, onEdit, onDelete }) {
    return (
      <div className="request-card">
        <h3>{surrenderDog.dogName}</h3>
        <div className="request-card-content">
          <p>Owner Name: {surrenderDog.ownerName}</p>
          <p>Owner Phone: {surrenderDog.ownerPhone}</p>
          <p>Owner Email: {surrenderDog.ownerEmail}</p>
          <p>Owner Address: {surrenderDog.ownerAddress}</p>
          <p>Dog Breed: {surrenderDog.dogBreed}</p>
          <p>Dog Age: {surrenderDog.dogAge}</p>
          <p>Dog Gender: {surrenderDog.dogGender}</p>
          <p>Dog Size: {surrenderDog.dogSize}</p>
          <p>Description: {surrenderDog.dogDescription}</p>
          <p>Vaccinated: {surrenderDog.isVaccinated ? 'Yes' : 'No'}</p>
          <p>Neutered: {surrenderDog.isNeutered ? 'Yes' : 'No'}</p>
          <p>Has Medical Issues: {surrenderDog.hasMedicalIssues ? 'Yes' : 'No'}</p>
          {surrenderDog.hasMedicalIssues && <p>Medical History: {surrenderDog.medicalHistory}</p>}
          <p>Reason for Surrender: {surrenderDog.surrenderReason}</p>
          <p>Urgent: {surrenderDog.isUrgent ? 'Yes' : 'No'}</p>
          <p>Preferred Date: {surrenderDog.preferredDate}</p>
          <p>Status: {surrenderDog.requestStatus}</p>
          <p>Admin Notes: {surrenderDog.adminNotes}</p>
          <p>Submission Date: {new Date(surrenderDog.submissionDate).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(surrenderDog.lastUpdated).toLocaleDateString()}</p>
          <p>Dog Photo: {surrenderDog.dogPhotoUrl ? <a href={surrenderDog.dogPhotoUrl} target="_blank">View Photo</a> : 'None'}</p>
        </div>
        <div className="request-actions">
          <button className="edit" onClick={() => onEdit(surrenderDog)}>Edit</button>
          <button className="delete" onClick={() => onDelete(surrenderDog.surrenderId)}>Delete</button>
        </div>
      </div>
    );
  }
  
  export default RequestCard;