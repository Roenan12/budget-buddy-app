import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/overlay/alert-dialog";

interface SampleAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleAccountDialog({
  isOpen,
  onClose,
}: SampleAccountDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sample Account</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>You can use these credentials to test the application:</p>
              <div className="bg-muted p-4 rounded-lg space-y-1">
                <div>
                  <span className="font-semibold">Email:</span> test@mail.com
                </div>
                <div>
                  <span className="font-semibold">Password:</span> 12345678
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
