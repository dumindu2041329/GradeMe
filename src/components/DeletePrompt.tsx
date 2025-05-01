import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeletePromptProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-prompt">
      <div className="delete-prompt-content">
        <div className="delete-prompt-icon">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold text-card-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="delete-prompt-button delete-prompt-cancel"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="delete-prompt-button delete-prompt-confirm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;