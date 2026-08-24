const LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function StatusStamp({ status }) {
  const label = LABELS[status] || status
  return <span className={`stamp stamp-${status}`}>{label}</span>
}
