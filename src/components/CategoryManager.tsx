import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useExpenseStore } from '../hooks/useExpenseStore';
import { toast } from '@/hooks/use-toast';

interface CategoryManagerProps {
  onClose: () => void;
}

const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', 
  '#ef4444', '#06b6d4', '#6b7280', '#84cc16',
  '#f97316', '#ec4899', '#14b8a6', '#a855f7'
];

export const CategoryManager = ({ onClose }: CategoryManagerProps) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: PRESET_COLORS[0],
  });

  const resetForm = () => {
    setFormData({ name: '', color: PRESET_COLORS[0] });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } else {
      addCategory(formData);
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    }

    resetForm();
  };

  const handleEdit = (category: any) => {
    setFormData({ name: category.name, color: category.color });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-foreground' : 'border-muted'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Add'} Category
                </Button>
              </div>
            </form>
          )}

          {/* Add Category Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          )}

          {/* Categories List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};