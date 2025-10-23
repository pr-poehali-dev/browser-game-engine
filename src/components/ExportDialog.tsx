import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ExportDialog = ({ open, onOpenChange }: ExportDialogProps) => {
  const platforms = [
    { id: 'windows', name: 'Windows', icon: 'Monitor', desc: 'Executable .exe file' },
    { id: 'mac', name: 'macOS', icon: 'Laptop', desc: 'Application bundle' },
    { id: 'linux', name: 'Linux', icon: 'Terminal', desc: 'AppImage package' },
    { id: 'android', name: 'Android', icon: 'Smartphone', desc: 'APK package' },
    { id: 'ios', name: 'iOS', icon: 'Tablet', desc: 'App Store package' },
    { id: 'web', name: 'Web', icon: 'Globe', desc: 'Browser game' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Download" size={20} />
            Export Project
          </DialogTitle>
          <DialogDescription>
            Choose platforms to export your game
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {platforms.map(platform => (
            <Card 
              key={platform.id}
              className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Icon name={platform.icon as any} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{platform.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{platform.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-primary">
            <Icon name="PackageCheck" size={16} className="mr-2" />
            Build Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
