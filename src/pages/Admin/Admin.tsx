import { useState } from 'react';
import type { CategoryInfo, Question, QuestionOption } from '../../types';
import {
  getCategories,
  getQuestions,
  saveCategories,
  saveQuestions,
  resetToDefaults,
} from '../../services/questionnaireService';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import styles from './Admin.module.css';

type Tab = 'categories' | 'questions';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('categories');
  const [categories, setCategoriesState] = useState<CategoryInfo[]>(getCategories);
  const [questions, setQuestionsState] = useState<Question[]>(getQuestions);

  const persistCategories = (cats: CategoryInfo[]) => {
    setCategoriesState(cats);
    saveCategories(cats);
  };

  const persistQuestions = (qs: Question[]) => {
    setQuestionsState(qs);
    saveQuestions(qs);
  };

  const handleReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס לברירת מחדל? כל השינויים יימחקו.')) {
      resetToDefaults();
      setCategoriesState(getCategories());
      setQuestionsState(getQuestions());
    }
  };

  return (
    <PageLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>ניהול שאלון</h1>
        <Button variant="outline" size="sm" onClick={handleReset}>
          איפוס לברירת מחדל
        </Button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'categories' ? styles.tabActive : ''}`}
          onClick={() => setTab('categories')}
        >
          ניהול קבוצות ({categories.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'questions' ? styles.tabActive : ''}`}
          onClick={() => setTab('questions')}
        >
          ניהול שאלות ({questions.length})
        </button>
      </div>

      {tab === 'categories' && (
        <CategoriesTab
          categories={categories}
          questions={questions}
          onChange={persistCategories}
          onDeleteCategory={(catId) => {
            persistQuestions(questions.filter((q) => q.category !== catId));
          }}
        />
      )}
      {tab === 'questions' && (
        <QuestionsTab
          categories={categories}
          questions={questions}
          onChange={persistQuestions}
        />
      )}
    </PageLayout>
  );
}

// ─── Categories Tab ───

function CategoriesTab({
  categories,
  questions,
  onChange,
  onDeleteCategory,
}: {
  categories: CategoryInfo[];
  questions: Question[];
  onChange: (cats: CategoryInfo[]) => void;
  onDeleteCategory: (catId: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const moveCategory = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const updated = [...categories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const deleteCategory = (catId: string) => {
    const questionsInCat = questions.filter((q) => q.category === catId).length;
    const msg = questionsInCat > 0
      ? `קבוצה זו מכילה ${questionsInCat} שאלות. מחיקת הקבוצה תמחק גם אותן. להמשיך?`
      : 'האם למחוק את הקבוצה?';
    if (confirm(msg)) {
      onChange(categories.filter((c) => c.id !== catId));
      onDeleteCategory(catId);
    }
  };

  const updateCategory = (updated: CategoryInfo) => {
    onChange(categories.map((c) => (c.id === updated.id ? updated : c)));
    setEditingId(null);
  };

  const addCategory = (newCat: CategoryInfo) => {
    onChange([...categories, newCat]);
    setIsAdding(false);
  };

  return (
    <div className={styles.section}>
      {categories.map((cat, index) => (
        <Card key={cat.id}>
          {editingId === cat.id ? (
            <CategoryEditor
              category={cat}
              existingIds={categories.map((c) => c.id)}
              onSave={updateCategory}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <span className={styles.itemIcon}>{cat.icon}</span>
                <div>
                  <span className={styles.itemTitle}>{cat.title}</span>
                  <span className={styles.itemMeta}>
                    {cat.id} | {cat.required ? 'חובה' : 'אופציונלי'} | {questions.filter((q) => q.category === cat.id).length} שאלות
                  </span>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => moveCategory(index, -1)} disabled={index === 0} title="הזז למעלה">▲</button>
                <button className={styles.iconBtn} onClick={() => moveCategory(index, 1)} disabled={index === categories.length - 1} title="הזז למטה">▼</button>
                <button className={styles.iconBtn} onClick={() => setEditingId(cat.id)} title="ערוך">✏️</button>
                <button className={styles.iconBtn} onClick={() => deleteCategory(cat.id)} title="מחק">🗑️</button>
              </div>
            </div>
          )}
        </Card>
      ))}

      {isAdding ? (
        <Card>
          <CategoryEditor
            existingIds={categories.map((c) => c.id)}
            onSave={addCategory}
            onCancel={() => setIsAdding(false)}
          />
        </Card>
      ) : (
        <Button variant="outline" fullWidth onClick={() => setIsAdding(true)}>
          + הוסף קבוצה
        </Button>
      )}
    </div>
  );
}

function CategoryEditor({
  category,
  existingIds,
  onSave,
  onCancel,
}: {
  category?: CategoryInfo;
  existingIds: string[];
  onSave: (cat: CategoryInfo) => void;
  onCancel: () => void;
}) {
  const [id, setId] = useState(category?.id ?? '');
  const [title, setTitle] = useState(category?.title ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '📝');
  const [required, setRequired] = useState(category?.required ?? false);
  const [error, setError] = useState('');
  const isEdit = !!category;

  const handleSave = () => {
    if (!id.trim() || !title.trim()) {
      setError('נא למלא מזהה ושם');
      return;
    }
    if (!isEdit && existingIds.includes(id.trim())) {
      setError('מזהה כבר קיים');
      return;
    }
    onSave({ id: id.trim(), title: title.trim(), description: description.trim(), icon, required });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorGrid}>
        <Input label="מזהה (ID)" value={id} onChange={setId} placeholder="my_category" />
        <Input label="שם" value={title} onChange={setTitle} placeholder="שם הקבוצה" />
        <Input label="תיאור" value={description} onChange={setDescription} placeholder="תיאור קצר" />
        <Input label="אייקון" value={icon} onChange={setIcon} placeholder="📝" />
      </div>
      <label className={styles.checkboxLabel}>
        <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
        קבוצת חובה
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.editorActions}>
        <Button size="sm" onClick={handleSave}>{isEdit ? 'שמור' : 'הוסף'}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>ביטול</Button>
      </div>
    </div>
  );
}

// ─── Questions Tab ───

function QuestionsTab({
  categories,
  questions,
  onChange,
}: {
  categories: CategoryInfo[];
  questions: Question[];
  onChange: (qs: Question[]) => void;
}) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = filterCategory === 'all'
    ? questions
    : questions.filter((q) => q.category === filterCategory);

  const deleteQuestion = (qId: string) => {
    if (confirm('האם למחוק את השאלה?')) {
      onChange(questions.filter((q) => q.id !== qId));
    }
  };

  const updateQuestion = (updated: Question) => {
    onChange(questions.map((q) => (q.id === updated.id ? updated : q)));
    setEditingId(null);
  };

  const addQuestion = (newQ: Question) => {
    onChange([...questions, newQ]);
    setIsAdding(false);
  };

  const typeLabels: Record<string, string> = {
    single: 'בחירה יחידה',
    multiple: 'בחירה מרובה',
    scale: 'סקאלה',
    open: 'טקסט פתוח',
  };

  return (
    <div className={styles.section}>
      <div className={styles.filterBar}>
        <select
          className={styles.select}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">כל הקבוצות</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.title}
            </option>
          ))}
        </select>
      </div>

      {filtered.map((question) => (
        <Card key={question.id}>
          {editingId === question.id ? (
            <QuestionEditor
              question={question}
              categories={categories}
              existingIds={questions.map((q) => q.id)}
              onSave={updateQuestion}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <div>
                  <span className={styles.itemTitle}>{question.text}</span>
                  <span className={styles.itemMeta}>
                    {question.id} | {typeLabels[question.type] ?? question.type} |
                    {categories.find((c) => c.id === question.category)?.title ?? question.category} |
                    משקל: {question.weight} | {question.required ? 'חובה' : 'אופציונלי'}
                    {question.options ? ` | ${question.options.length} אופציות` : ''}
                  </span>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => setEditingId(question.id)} title="ערוך">✏️</button>
                <button className={styles.iconBtn} onClick={() => deleteQuestion(question.id)} title="מחק">🗑️</button>
              </div>
            </div>
          )}
        </Card>
      ))}

      {isAdding ? (
        <Card>
          <QuestionEditor
            categories={categories}
            existingIds={questions.map((q) => q.id)}
            onSave={addQuestion}
            onCancel={() => setIsAdding(false)}
          />
        </Card>
      ) : (
        <Button variant="outline" fullWidth onClick={() => setIsAdding(true)}>
          + הוסף שאלה
        </Button>
      )}
    </div>
  );
}

function QuestionEditor({
  question,
  categories,
  existingIds,
  onSave,
  onCancel,
}: {
  question?: Question;
  categories: CategoryInfo[];
  existingIds: string[];
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [id, setId] = useState(question?.id ?? '');
  const [text, setText] = useState(question?.text ?? '');
  const [type, setType] = useState(question?.type ?? 'single');
  const [category, setCategory] = useState(question?.category ?? (categories[0]?.id ?? ''));
  const [required, setRequired] = useState(question?.required ?? true);
  const [weight, setWeight] = useState(question?.weight?.toString() ?? '1');
  const [options, setOptions] = useState<QuestionOption[]>(question?.options ?? []);
  const [minScale, setMinScale] = useState(question?.minScale?.toString() ?? '1');
  const [maxScale, setMaxScale] = useState(question?.maxScale?.toString() ?? '10');
  const [minLabel, setMinLabel] = useState(question?.scaleLabels?.min ?? '');
  const [maxLabel, setMaxLabel] = useState(question?.scaleLabels?.max ?? '');
  const [placeholder, setPlaceholder] = useState(question?.placeholder ?? '');
  const [error, setError] = useState('');
  const isEdit = !!question;

  const showOptions = type === 'single' || type === 'multiple';
  const showScale = type === 'scale';
  const showPlaceholder = type === 'open';

  const addOption = () => {
    setOptions([...options, { id: `opt_${Date.now()}`, text: '', value: 1 }]);
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: string | number) => {
    setOptions(options.map((o, i) => (i === index ? { ...o, [field]: value } : o)));
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!id.trim() || !text.trim()) {
      setError('נא למלא מזהה וטקסט');
      return;
    }
    if (!isEdit && existingIds.includes(id.trim())) {
      setError('מזהה שאלה כבר קיים');
      return;
    }
    if (showOptions && options.length < 2) {
      setError('נדרשות לפחות 2 אופציות');
      return;
    }

    const q: Question = {
      id: id.trim(),
      text: text.trim(),
      type,
      category,
      required,
      weight: Number(weight) || 0,
    };

    if (showOptions) {
      q.options = options.map((o) => ({ ...o, text: o.text.trim(), value: Number(o.value) || 0 }));
    }
    if (showScale) {
      q.minScale = Number(minScale) || 1;
      q.maxScale = Number(maxScale) || 10;
      if (minLabel || maxLabel) {
        q.scaleLabels = { min: minLabel, max: maxLabel };
      }
    }
    if (showPlaceholder && placeholder.trim()) {
      q.placeholder = placeholder.trim();
    }

    onSave(q);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorGrid}>
        <Input label="מזהה (ID)" value={id} onChange={setId} placeholder="question_id" />
        <Input label="טקסט השאלה" value={text} onChange={setText} placeholder="מה השאלה?" />
      </div>

      <div className={styles.editorRow}>
        <div className={styles.selectField}>
          <label className={styles.selectLabel}>סוג</label>
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as Question['type'])}>
            <option value="single">בחירה יחידה</option>
            <option value="multiple">בחירה מרובה</option>
            <option value="scale">סקאלה</option>
            <option value="open">טקסט פתוח</option>
          </select>
        </div>
        <div className={styles.selectField}>
          <label className={styles.selectLabel}>קבוצה</label>
          <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
            ))}
          </select>
        </div>
        <Input label="משקל" value={weight} onChange={setWeight} placeholder="0-5" />
      </div>

      <label className={styles.checkboxLabel}>
        <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
        שאלת חובה
      </label>

      {showOptions && (
        <div className={styles.optionsSection}>
          <h4 className={styles.sectionSubtitle}>אופציות</h4>
          {options.map((opt, index) => (
            <div key={index} className={styles.optionRow}>
              <Input
                value={opt.id}
                onChange={(v) => updateOption(index, 'id', v)}
                placeholder="ID"
              />
              <Input
                value={opt.text}
                onChange={(v) => updateOption(index, 'text', v)}
                placeholder="טקסט"
              />
              <Input
                value={opt.value.toString()}
                onChange={(v) => updateOption(index, 'value', Number(v) || 0)}
                placeholder="ערך"
              />
              <button className={styles.iconBtn} onClick={() => removeOption(index)} title="הסר">✕</button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addOption}>
            + הוסף אופציה
          </Button>
        </div>
      )}

      {showScale && (
        <div className={styles.editorGrid}>
          <Input label="ערך מינימלי" value={minScale} onChange={setMinScale} />
          <Input label="ערך מקסימלי" value={maxScale} onChange={setMaxScale} />
          <Input label="תווית מינימום" value={minLabel} onChange={setMinLabel} placeholder="למשל: נמוך" />
          <Input label="תווית מקסימום" value={maxLabel} onChange={setMaxLabel} placeholder="למשל: גבוה" />
        </div>
      )}

      {showPlaceholder && (
        <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} placeholder="טקסט רמז..." />
      )}

      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.editorActions}>
        <Button size="sm" onClick={handleSave}>{isEdit ? 'שמור' : 'הוסף'}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>ביטול</Button>
      </div>
    </div>
  );
}
