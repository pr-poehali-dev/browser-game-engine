import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type GameObject = {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'light' | 'camera';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  children: GameObject[];
};

const Index = () => {
  const [selectedObject, setSelectedObject] = useState<GameObject | null>(null);
  const [sceneObjects, setSceneObjects] = useState<GameObject[]>([
    {
      id: 'camera-main',
      name: 'Main Camera',
      type: 'camera',
      position: { x: 0, y: 1, z: -10 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      children: []
    },
    {
      id: 'light-directional',
      name: 'Directional Light',
      type: 'light',
      position: { x: 0, y: 3, z: 0 },
      rotation: { x: 50, y: -30, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      children: []
    }
  ]);

  const addObject = (type: 'cube' | 'sphere' | 'light') => {
    const newObject: GameObject = {
      id: `${type}-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${sceneObjects.length}`,
      type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      children: []
    };
    setSceneObjects([...sceneObjects, newObject]);
    setSelectedObject(newObject);
  };

  const updateObjectProperty = (category: 'position' | 'rotation' | 'scale', axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedObject) return;
    
    const updated = {
      ...selectedObject,
      [category]: {
        ...selectedObject[category],
        [axis]: value
      }
    };
    
    setSelectedObject(updated);
    setSceneObjects(sceneObjects.map(obj => obj.id === updated.id ? updated : obj));
  };

  const renderHierarchyItem = (obj: GameObject, depth = 0) => (
    <div key={obj.id} style={{ paddingLeft: `${depth * 16}px` }}>
      <button
        onClick={() => setSelectedObject(obj)}
        className={`w-full text-left px-2 py-1 text-sm hover:bg-accent/50 flex items-center gap-2 rounded ${
          selectedObject?.id === obj.id ? 'bg-accent' : ''
        }`}
      >
        <Icon 
          name={obj.type === 'camera' ? 'Camera' : obj.type === 'light' ? 'Lightbulb' : 'Box'} 
          size={14} 
        />
        {obj.name}
      </button>
      {obj.children.map(child => renderHierarchyItem(child, depth + 1))}
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-[hsl(var(--editor-bg))] text-foreground overflow-hidden">
      <div className="toolbar h-10 flex items-center justify-between px-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Gamepad2" size={20} className="text-primary" />
            <span className="font-semibold text-sm">Game Engine</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Icon name="File" size={14} className="mr-1" />
              File
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Icon name="Pencil" size={14} className="mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Icon name="Settings" size={14} className="mr-1" />
              Project
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="h-7 bg-secondary hover:bg-secondary/80">
            <Icon name="Play" size={14} className="mr-1" />
            Play
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="panel w-64 flex flex-col">
          <div className="toolbar h-9 flex items-center justify-between px-3">
            <span className="text-xs font-medium">Hierarchy</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Icon name="Plus" size={14} />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sceneObjects.map(obj => renderHierarchyItem(obj))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="toolbar h-9 flex items-center justify-between px-3">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={() => addObject('cube')}
              >
                <Icon name="Box" size={14} className="mr-1" />
                Cube
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={() => addObject('sphere')}
              >
                <Icon name="Circle" size={14} className="mr-1" />
                Sphere
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={() => addObject('light')}
              >
                <Icon name="Lightbulb" size={14} className="mr-1" />
                Light
              </Button>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Icon name="Move" size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Icon name="RotateCw" size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Icon name="Maximize2" size={14} />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-[hsl(var(--panel-bg))] m-2 rounded border border-[hsl(var(--panel-border))] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative w-full h-full"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, hsl(0 0% 15%) 0%, hsl(0 0% 9.4%) 100%)',
                  backgroundImage: `
                    linear-gradient(hsl(0 0% 20% / 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(0 0% 20% / 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {sceneObjects.filter(obj => obj.type === 'cube' || obj.type === 'sphere').map(obj => (
                    <div
                      key={obj.id}
                      className={`absolute transition-all cursor-pointer hover:scale-105 ${
                        selectedObject?.id === obj.id ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{
                        width: `${obj.scale.x * 80}px`,
                        height: `${obj.scale.y * 80}px`,
                        transform: `translate(${obj.position.x * 50}px, ${-obj.position.y * 50}px) rotate(${obj.rotation.z}deg)`,
                        borderRadius: obj.type === 'sphere' ? '50%' : '4px',
                        background: obj.type === 'cube' 
                          ? 'linear-gradient(135deg, hsl(207 100% 50%), hsl(207 100% 35%))' 
                          : 'radial-gradient(circle at 30% 30%, hsl(174 97% 50%), hsl(174 97% 35%))',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                      }}
                      onClick={() => setSelectedObject(obj)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel w-72 flex flex-col">
          <div className="toolbar h-9 flex items-center px-3">
            <span className="text-xs font-medium">Inspector</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {selectedObject ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input 
                      value={selectedObject.name} 
                      className="h-8 mt-1 text-sm"
                      onChange={(e) => {
                        const updated = { ...selectedObject, name: e.target.value };
                        setSelectedObject(updated);
                        setSceneObjects(sceneObjects.map(obj => obj.id === updated.id ? updated : obj));
                      }}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-xs font-semibold mb-2 block">Transform</Label>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Position</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['x', 'y', 'z'] as const).map(axis => (
                            <div key={axis}>
                              <Label className="text-xs text-primary mb-1 block">{axis.toUpperCase()}</Label>
                              <Input
                                type="number"
                                value={selectedObject.position[axis]}
                                onChange={(e) => updateObjectProperty('position', axis, parseFloat(e.target.value) || 0)}
                                className="h-7 text-xs"
                                step="0.1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Rotation</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['x', 'y', 'z'] as const).map(axis => (
                            <div key={axis}>
                              <Label className="text-xs text-secondary mb-1 block">{axis.toUpperCase()}</Label>
                              <Input
                                type="number"
                                value={selectedObject.rotation[axis]}
                                onChange={(e) => updateObjectProperty('rotation', axis, parseFloat(e.target.value) || 0)}
                                className="h-7 text-xs"
                                step="1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Scale</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['x', 'y', 'z'] as const).map(axis => (
                            <div key={axis}>
                              <Label className="text-xs text-accent mb-1 block">{axis.toUpperCase()}</Label>
                              <Input
                                type="number"
                                value={selectedObject.scale[axis]}
                                onChange={(e) => updateObjectProperty('scale', axis, parseFloat(e.target.value) || 0)}
                                className="h-7 text-xs"
                                step="0.1"
                                min="0.1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={selectedObject.type === 'cube' ? 'Box' : 'Circle'} size={16} className="text-primary" />
                      <span className="text-xs font-medium">
                        {selectedObject.type === 'cube' ? 'Mesh Renderer' : selectedObject.type === 'sphere' ? 'Sphere Collider' : 'Light Source'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Component properties will appear here
                    </p>
                  </Card>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <Icon name="MousePointerClick" size={32} className="mx-auto mb-2 opacity-50" />
                  Select an object to view properties
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="toolbar h-6 flex items-center justify-between px-3 text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>Ready</span>
          <span>•</span>
          <span>{sceneObjects.length} objects</span>
        </div>
        <div className="flex gap-4">
          <span>FPS: 60</span>
          <span>•</span>
          <span>Viewport: 3D</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
