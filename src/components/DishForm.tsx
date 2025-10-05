import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dish } from '@/types/menu';
import imageCompression from 'browser-image-compression';


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
  const [compressing, setCompressing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [compressedFileSize, setCompressedFileSize] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();
  const { tenantId } = useAuth();

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Enhanced image compression function
  const compressImage = async (file: File): Promise<File> => {
    setCompressing(true);
    try {
      console.log('Original file size:', formatFileSize(file.size));
      
      const options = {
        maxSizeMB: 2, // Maximum size after compression
        maxWidthOrHeight: 1920, // Maximum dimensions
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert to JPEG for better compression
        quality: 0.8 // Quality level
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Compressed file size:', formatFileSize(compressedFile.size));
      
      setCompressedFileSize(compressedFile.size);
      
      toast({
        title: "Imagen comprimida",
        description: `Tamaño reducido de ${formatFileSize(file.size)} a ${formatFileSize(compressedFile.size)}`,
        variant: "default"
      });

      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      toast({
        title: "Error de compresión",
        description: "No se pudo comprimir la imagen, se usará el original",
        variant: "destructive"
      });
      return file;
    } finally {
      setCompressing(false);
    }
  };

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name, 'Size:', formatFileSize(file.size));
      
      // Store original file size for display
      setOriginalFileSize(file.size);
      
      // Check if file is larger than 10MB (absolute limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: `La imagen es de ${formatFileSize(file.size)}. El límite máximo es 10MB. Por favor, selecciona una imagen más pequeña.`,
          variant: "destructive"
        });
        return;
      }

      try {
        let processedFile = file;
        
        // Auto-compress if larger than 2MB
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "Comprimiendo imagen",
            description: `Archivo de ${formatFileSize(file.size)} detectado. Comprimiendo automáticamente...`,
            variant: "default"
          });
          
          processedFile = await compressImage(file);
        }

        setImageFile(processedFile);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(processedFile);

        // Show success message with final size
        toast({
          title: "Imagen cargada",
          description: `Archivo procesado: ${formatFileSize(processedFile.size)}`,
          variant: "default"
        });

      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "Error al procesar imagen",
          description: "Hubo un problema al procesar la imagen. Inténtalo de nuevo.",
          variant: "destructive"
        });
      }
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !tenantId) return null;
    
    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      // Organizar por tenant
      const filePath = `${tenantId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('dish-images')
        .upload(filePath, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

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
    // Reset file size info
    setOriginalFileSize(0);
    setCompressedFileSize(0);
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

      if (!tenantId) {
        toast({
          title: "Error",
          description: "No se pudo determinar el tenant",
          variant: "destructive"
        });
        setLoading(false);
        return;
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
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : 0,
        tenant_id: tenantId
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
                  
                  {/* File size information */}
                  {(originalFileSize > 0 || compressedFileSize > 0) && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="w-4 h-4" />
                        <span className="font-medium">Información del archivo:</span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {originalFileSize > 0 && (
                          <div>Tamaño original: {formatFileSize(originalFileSize)}</div>
                        )}
                        {compressedFileSize > 0 && compressedFileSize !== originalFileSize && (
                          <div className="text-green-600">
                            Tamaño después de compresión: {formatFileSize(compressedFileSize)}
                          </div>
                        )}
                        {imageFile && (
                          <div>Tamaño final: {formatFileSize(imageFile.size)}</div>
                        )}
                      </div>
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
                        disabled={compressing}
                      />
                      <Label 
                        htmlFor="image-upload"
                        className={`inline-flex items-center justify-center w-full p-4 border border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 ${compressing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {compressing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Comprimiendo...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mr-2" />
                            Subir Nueva Imagen
                          </>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Máximo 10MB. Las imágenes mayores a 2MB se comprimen automáticamente.
                      </p>
                    </div>
                    
                    <div className="flex-1">
                      <Input
                        placeholder="O pegar URL de imagen"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          setImagePreview(e.target.value);
                          // Reset file size info when using URL
                          setOriginalFileSize(0);
                          setCompressedFileSize(0);
                        }}
                        disabled={compressing}
                      />
                    </div>
                  </div>
                  
                  {(uploading || compressing) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {compressing ? 'Comprimiendo imagen...' : 'Subiendo imagen...'}
                    </div>
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