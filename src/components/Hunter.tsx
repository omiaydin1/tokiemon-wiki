import { useState, useEffect } from "react";
import { Target, MapPin, Crown } from "lucide-react";

interface HuntingInfo {
  capture: boolean;
  scene: string;
  only: boolean;
  premium: boolean;
}

interface Community {
  communityId: string;
  name: string;
  symbol: string;
  logoURI: string;
  extraPaymentTokens: string[];
  tags: string[];
  inactive?: boolean;
  hunting?: HuntingInfo;
}

export default function Hunter() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScene, setSelectedScene] = useState<string>("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showHunterOnly, setShowHunterOnly] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/alma-labs/tokiemon-lists/refs/heads/main/tokens/allCommunity.json"
        );
        if (!response.ok) throw new Error("Failed to fetch communities");
        const data = await response.json();
        
        // Filter only communities where hunting.capture = true
        const huntable = data.filter(
          (community: Community) => community.hunting?.capture === true
        );
        
        setCommunities(huntable);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load huntable communities:", err);
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const scenes = ["all", ...Array.from(new Set(communities.map(c => c.hunting?.scene).filter(Boolean)))];
  
  let filteredCommunities = selectedScene === "all" 
    ? communities 
    : communities.filter(c => c.hunting?.scene === selectedScene);
  
  if (showPremiumOnly) {
    filteredCommunities = filteredCommunities.filter(c => c.hunting?.premium === true);
  }
  
  if (showHunterOnly) {
    filteredCommunities = filteredCommunities.filter(c => c.hunting?.only === true);
  }

  const getSceneColor = (scene: string) => {
    switch (scene) {
      case "FARM": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "WOODS": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "TOWN": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "BEACH": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-slate-400 text-center py-12">
          Loading huntable Tokiemon...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-red-500" />
        <h2 className="text-3xl font-bold text-white">Hunter</h2>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <div className="text-slate-400 mb-3">Filter by Scene:</div>
            <div className="flex flex-wrap gap-2">
              {scenes.map((scene) => (
                <button
                  key={scene}
                  onClick={() => setSelectedScene(scene)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    selectedScene === scene
                      ? "bg-red-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {scene === "all" ? "All Scenes" : scene}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-400 mb-3">Additional Filters:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showPremiumOnly
                    ? "bg-yellow-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                <Crown className="w-4 h-4" />
                V-Card Req.
              </button>
              <button
                onClick={() => setShowHunterOnly(!showHunterOnly)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showHunterOnly
                    ? "bg-purple-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Hunter Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredCommunities.map((community) => (
          <div
            key={community.communityId}
            className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700/50 transition-colors border border-slate-700 relative"
          >
            {community.hunting && (
              <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${getSceneColor(community.hunting.scene)}`}>
                <MapPin className="w-2.5 h-2.5" />
                {community.hunting.scene}
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <img
                src={community.logoURI}
                alt={community.name}
                className="w-12 h-12 rounded-lg border border-slate-600"
              />
              <div className="flex-1 min-w-0 pr-16">
                <div className="text-white font-medium text-sm mb-0.5 truncate">
                  {community.name}
                </div>
                <div className="text-slate-400 text-xs mb-1.5">
                  {community.symbol}
                </div>
                
                {community.hunting && (community.hunting.premium || community.hunting.only) && (
                  <div className="flex gap-1.5">
                    {community.hunting.premium && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <Crown className="w-2.5 h-2.5" />
                        V-Card
                      </div>
                    )}
                    {community.hunting.only && (
                      <div className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Hunter
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-slate-400 text-center py-12">
          No huntable Tokiemon found for this scene
        </div>
      )}
    </main>
  );
}

