import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

type CodeEditorProps = {
  onClose: () => void;
};

const CodeEditor = ({ onClose }: CodeEditorProps) => {
  const [code, setCode] = useState(`// Game Object Script
class GameObject {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
  }
  
  update(deltaTime) {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.position.z += this.velocity.z * deltaTime;
  }
  
  onCollision(other) {
    console.log('Collision detected!', other);
  }
}

// Export your game object
export default GameObject;`);

  return (
    <div className="absolute inset-0 bg-[hsl(var(--editor-bg))] z-50 flex flex-col">
      <div className="toolbar h-10 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Icon name="Code" size={18} className="text-primary" />
          <span className="font-semibold text-sm">Script Editor</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7">
            <Icon name="Save" size={14} className="mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" className="h-7" onClick={onClose}>
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full font-mono text-sm resize-none"
            style={{ minHeight: '100%' }}
          />
        </div>
        
        <div className="w-64 panel border-l">
          <div className="toolbar h-9 px-3 flex items-center">
            <span className="text-xs font-medium">Console</span>
          </div>
          <ScrollArea className="h-[calc(100%-2.25rem)]">
            <div className="p-3 space-y-2">
              <div className="text-xs text-green-400">✓ Script compiled successfully</div>
              <div className="text-xs text-muted-foreground">Ready to run</div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
