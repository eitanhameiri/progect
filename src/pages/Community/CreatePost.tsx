import { useState } from 'react';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import styles from './CreatePost.module.css';

interface CreatePostProps {
  onSubmit: (content: string) => void;
}

export default function CreatePost({ onSubmit }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <Card>
      <div className={styles.container}>
        {!isExpanded ? (
          <button
            className={styles.trigger}
            onClick={() => setIsExpanded(true)}
          >
            מה בא לך לשתף? 💭
          </button>
        ) : (
          <>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="שתף שאלה, תובנה, או משהו שלמדת..."
              rows={4}
              autoFocus
            />
            <div className={styles.actions}>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                size="sm"
              >
                פרסם
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsExpanded(false);
                  setContent('');
                }}
                size="sm"
              >
                ביטול
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
