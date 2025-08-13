import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dish } from '@/types/menu';


interface DishFormProps {
  dish?: Dish | null;
  onSave: () => void;
  onCancel: () => void;
}

const DishForm = ({ dish, onSave, onCancel }: DishFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    full_description: '',
    ingredients: '',
    price: '',
    image: '',
    category: 'appetizer' as 'appetizer' | 'main' | 'dessert',
    available: true,
    discount_percentage: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name,
        description: dish.description,
        full_description: dish.full_description,
        ingredients: dish.ingredients.join(', '),
        price: dish.price.toString(),
        image: dish.image,
        category: dish.category,
        available: dish.available,
        discount_percentage: dish.discount_percentage?.toString() || ''
      });
      setImagePreview(dish.image);
    }
  }, [dish]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "La imagen no puede ser mayor a 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('dish-images')
        .upload(fileName, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if there's a new one
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const dishData = {
        name: formData.name,
        description: formData.description,
        full_description: formData.full_description,
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
        price: parseFloat(formData.price),
        image: imageUrl,
        category: formData.category,
        available: formData.available,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : 0
      };

      let error;
      
      if (dish) {
        const { error: updateError } = await supabase
          .from('dishes')
          .update(dishData)
          .eq('id', dish.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('dishes')
          .insert([dishData]);
        error = insertError;
      }

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: dish ? "Plato actualizado" : "Plato creado",
          description: `${formData.name} ha sido ${dish ? 'actualizado' : 'creado'} correctamente`
        });
        onSave();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-warm-cream/30 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
              {dish ? 'Editar Plato' : 'Agregar Nuevo Plato'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre del Plato</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción Corta</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_description">Descripción Completa</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredientes (separados por comas)</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Ingrediente 1, Ingrediente 2, Ingrediente 3..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount_percentage">Descuento (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'appetizer' | 'main' | 'dessert') => 
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Entrante</SelectItem>
                      <SelectItem value="main">Principal</SelectItem>
                      <SelectItem value="dessert">Postre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Imagen del Plato</Label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label 
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center w-full p-4 border border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Subir Nueva Imagen
                      </Label>
                    </div>
                    
                    <div className="flex-1">
                      <Input
                        placeholder="O pegar URL de imagen"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  
                  {uploading && (
                    <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <Label htmlFor="available">Disponible</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-gradient-to-r from-spanish-red to-spanish-orange"
                >
                  {loading || uploading ? 'Guardando...' : (dish ? 'Actualizar' : 'Crear')}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DishForm;