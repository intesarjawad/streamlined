export const buttonStyles = {
  // Primary actions (like Publish, Create New, Fetch)
  primary: {
    default: "bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30",
    success: "bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30",
    destructive: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
  },
  
  // Secondary actions (like View, Back, Save Draft)
  secondary: {
    default: "bg-black/40 hover:bg-neon-blue/10 text-white hover:text-neon-blue border border-white/10 hover:border-neon-blue/30",
    active: "bg-neon-blue/10 text-neon-blue border border-neon-blue/30"
  },
  
  // Ghost actions (like Copy, External Link)
  ghost: {
    default: "text-white/70 hover:text-neon-blue hover:bg-neon-blue/10",
    destructive: "text-white/70 hover:text-red-400 hover:bg-red-500/10"
  }
}; 