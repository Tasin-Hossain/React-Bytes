
import { useNavigate } from "react-router";
import Button from "../ui/Button/Button";

export const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-32 text-center">
      <p className="text-lg text-(--text-primary)">Nothing here yet...</p>
      <p className="text-sm text-(--text-muted)">Tap the heart on any component to save it</p>
      <Button
        onClick={() => navigate('/text-animations/magnetic-text')}
        text='Browse Components'
      />

    </div>
  );
};