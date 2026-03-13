import "./MemberList.css";

export default function MemberList({ members, currentUser }) {
  return (
    <div className="memberlist-container">

      {/* Header */}
      <div className="memberlist-header">
        <span className="memberlist-title">Online</span>
        <span className="memberlist-count">{members.length}</span>
      </div>

      {/* Members */}
      <div className="memberlist-items">
        {members.map((member, index) => (
          <div key={index} className="memberlist-item">

            {/* Avatar */}
            <div className="memberlist-avatar">
              {member.username.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="memberlist-info">
              <span className="memberlist-name">
                {member.username}
                {member.username === currentUser && (
                  <span className="memberlist-you"> (you)</span>
                )}
              </span>
            </div>

            {/* Online dot */}
            <div className="memberlist-dot" />

          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="memberlist-footer">
        Members leave no trace.
      </p>

    </div>
  );
}