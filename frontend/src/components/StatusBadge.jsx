import Icon from './Icon';

export const StatusBadge = ({ status }) => {
  const map = {
    'Processing':             { cls: 'badge-processing', icon: 'refresh' },
    'Ready for Collection':   { cls: 'badge-ready',      icon: 'check'   },
    'Collected':              { cls: 'badge-collected',  icon: 'check'   },
    'Open':                   { cls: 'badge-lost',       icon: 'alert'   },
    'Matched':                { cls: 'badge-found',      icon: 'check'   },
    'Awaiting Owner':         { cls: 'badge-processing', icon: 'eye'     },
    'Closed':                 { cls: 'badge-collected',  icon: 'check'   },
    'Claimed':                { cls: 'badge-found',      icon: 'check'   },
  };
  const { cls, icon } = map[status] || { cls: 'badge-pending', icon: 'alert' };
  return (
    <span className={`badge ${cls}`}>
      <Icon name={icon} size={12} /> {status}
    </span>
  );
};

export const DocTypeIcon = ({ type }) => {
  const map = {
    'National ID':          { icon: 'id',       color: '#0a5c36', bg: '#e8f5ef' },
    'Passport':             { icon: 'passport', color: '#1d4ed8', bg: '#eff6ff' },
    'Driving License':      { icon: 'car',      color: '#7c3aed', bg: '#f5f3ff' },
    'KRA PIN Certificate':  { icon: 'pin',      color: '#c8102e', bg: '#fdf0f2' },
  };
  const { icon, color, bg } = map[type] || { icon: 'file', color: '#6b7280', bg: '#f9fafb' };
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name={icon} size={22} color={color} />
    </div>
  );
};
