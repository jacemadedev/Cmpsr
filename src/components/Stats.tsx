import { Brain, Cpu, Zap } from 'lucide-react';

export function Stats() {
  return (
    <div className="stats w-full bg-base-100 shadow">
      <div className="stat">
        <div className="stat-figure text-primary">
          <Zap className="h-8 w-8" />
        </div>
        <div className="stat-title">Total Requests</div>
        <div className="stat-value">31K</div>
        <div className="stat-desc">Jan 1st - Feb 1st</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <Brain className="h-8 w-8" />
        </div>
        <div className="stat-title">Active Models</div>
        <div className="stat-value">4</div>
        <div className="stat-desc">↗︎ 2 new models added</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <Cpu className="h-8 w-8" />
        </div>
        <div className="stat-title">Processing Time</div>
        <div className="stat-value">1.2s</div>
        <div className="stat-desc">↘︎ 0.3s improvement</div>
      </div>
    </div>
  );
}
