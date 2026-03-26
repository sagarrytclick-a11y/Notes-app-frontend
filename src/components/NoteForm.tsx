import React, { useState, useEffect } from 'react';
import { notesAPI } from '../utils/api';
import { X } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteFormProps {
  note: Note | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!note;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && note) {
        await notesAPI.updateNote(note._id, title.trim(), body.trim());
      } else {
        await notesAPI.createNote(title.trim(), body.trim());
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label>Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              maxLength={5000}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
