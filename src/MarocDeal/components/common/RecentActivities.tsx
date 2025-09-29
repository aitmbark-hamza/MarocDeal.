import { Search } from 'lucide-react';

export default function RecentActivities() {
  return (
    <div className="hidden lg:flex justify-center items-center relative animate-slide-in-right animation-delay-300">
      <div className="relative w-80 h-80">
        {/* Main 3D Comparison Icon */}
        <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
        
        {/* Floating Cards */}
        <div className="absolute top-8 left-8 bg-card border border-border rounded-lg p-4 shadow-card animate-float-1 animate-slide-in-right animation-delay-500 transform hover:scale-110 transition-transform duration-300">
          <div className="w-16 h-12 bg-gradient-primary rounded opacity-80 flex items-center justify-center">
            <img src="/avito.png" alt="Avito" className="w-12 h-8 object-contain" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Avito</div>
          <div className="text-sm font-semibold text-primary">299 MAD</div>
        </div>
        
        <div className="absolute top-16 right-12 bg-card border border-border rounded-lg p-4 shadow-card animate-float-2 animate-slide-in-right animation-delay-700 transform hover:scale-110 transition-transform duration-300">
          <div className="w-16 h-12 bg-gradient-card rounded opacity-80 flex items-center justify-center">
            <img src="/Jumia.png" alt="Jumia" className="w-12 h-8 object-contain" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Jumia</div>
          <div className="text-sm font-semibold text-success">279 MAD</div>
        </div>
        
        <div className="absolute bottom-12 left-12 bg-card border border-border rounded-lg p-4 shadow-card animate-float-3 animate-slide-in-right animation-delay-900 transform hover:scale-110 transition-transform duration-300">
          <div className="w-16 h-12 bg-gradient-hero rounded opacity-80 flex items-center justify-center">
            <img src="/marjane.png" alt="Marjane" className="w-12 h-8 object-contain" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Marjane</div>
          <div className="text-sm font-semibold text-warning">289 MAD</div>
        </div>

        {/* Central Comparison Symbol */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-featured animate-bounce-slow animate-scale-in animation-delay-1100">
          <Search className="w-8 h-8 text-primary-foreground" />
        </div>

        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full -rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full rotate-12 animate-pulse"></div>
      </div>
    </div>
  );
}