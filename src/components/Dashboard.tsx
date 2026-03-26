import React, { useState, useEffect } from 'react';
import { notesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import NoteForm from './NoteForm';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user, logout } = useAuth();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotes();
      setNotes(response.data.notes);
      setError('');
    } catch (err: any) {
      setError('Failed to load notes');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      setError('Failed to delete note');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchNotes();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Notes</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <div className="actions-bar">
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={16} style={{ marginRight: '8px' }} />
            New Note
          </button>
        </div>

        {showForm && (
          <NoteForm
            note={editingNote}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={() => handleEdit(note)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="btn-icon"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="note-body">{note.body}</p>
                <div className="note-footer">
                  <span className="note-date">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
