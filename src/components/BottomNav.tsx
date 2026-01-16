import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: 'Home', label: 'Главная' },
    { path: '/profile', icon: 'User', label: 'Профиль' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-2 border-primary/20 shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-2 gap-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} className={`w-6 h-6 mb-1 ${isActive ? 'fill-white' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
