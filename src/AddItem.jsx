
import { useState } from 'react'
import './AddItem.css'

function AddItem({ onCancel, onSave, editItem = null, existingItems = [] }) {
  const emptyForm = {
    name: '',
    id: '',
    category: '',
    description: '',
    unit: '',
    location: '',
    quantity: '',
    reorder: '',
    supplier: ''
  }

  const [form, setForm] = useState(() => ({ ...emptyForm, ...(editItem || {}) }))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSubmitting) return

    const newErrors = {}

    const requiredFields = [
      'name',
      'id',
      'category',
      'unit',
      'location',
      'quantity',
      'reorder'
    ]

    requiredFields.forEach(field => {
      if (String(form[field]).trim() === '') {
        newErrors[field] = 'This field is required.'
      }
    })

    if (
      form.quantity !== '' &&
      (!Number.isInteger(Number(form.quantity)) ||
        Number(form.quantity) < 0)
    ) {
      newErrors.quantity = 'Enter a valid non-negative whole number.'
    }

    if (
      form.reorder !== '' &&
      (!Number.isInteger(Number(form.reorder)) ||
        Number(form.reorder) < 0)
    ) {
      newErrors.reorder = 'Enter a valid non-negative whole number.'
    }

    const normalizedId = form.id.trim().toUpperCase()

    const duplicateId = existingItems.some(item =>
      String(item.id).trim().toUpperCase() === normalizedId &&
      String(item.id).trim().toUpperCase() !==
        String(editItem?.id || '').trim().toUpperCase()
    )

    if (normalizedId && duplicateId) {
      newErrors.id = 'This Item ID already exists.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    onSave({
      ...form,
      name: form.name.trim(),
      id: normalizedId,
      quantity: Number(form.quantity),
      reorder: Number(form.reorder)
    })
  }

  const fieldError = (field) => (
    errors[field] && (
      <small className="field-error" role="alert">
        {errors[field]}
      </small>
    )
  )

  return (
    <div className="add-item-page">
      <div className="form-heading">
        <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
        <p>
          {editItem
            ? 'Update the item information below.'
            : 'Add a new product to your inventory.'}
        </p>
      </div>

      <form className="item-form" onSubmit={handleSubmit} noValidate>
        <h3>Basic Information</h3>

        <div className="form-grid">
          <label>
            Item Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
              aria-invalid={!!errors.name}
            />
            {fieldError('name')}
          </label>

          <label>
            Item ID *
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="e.g. INV-1007"
              disabled={!!editItem}
              required
              aria-invalid={!!errors.id}
            />
            {fieldError('id')}
          </label>

          <label>
            Category *
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              aria-invalid={!!errors.category}
            >
              <option value="">Select category</option>
              <option>Equipment</option>
              <option>Safety</option>
              <option>Raw Materials</option>
              <option>Furniture</option>
              <option>Electrical</option>
            </select>
            {fieldError('category')}
          </label>

          <label>
            Unit of Measure *
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              aria-invalid={!!errors.unit}
            >
              <option value="">Select unit</option>
              <option>Pieces</option>
              <option>Boxes</option>
              <option>Kilograms</option>
              <option>Litres</option>
              <option>Pairs</option>
              <option>Metres</option>
            </select>
            {fieldError('unit')}
          </label>
        </div>

        <label className="full-field">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter item description"
          />
        </label>

        <h3>Stock & Location</h3>

        <div className="form-grid">
          <label>
            Storage Location *
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              aria-invalid={!!errors.location}
            >
              <option value="">Select location</option>
              <option>Warehouse A</option>
              <option>Warehouse B</option>
              <option>Warehouse C</option>
            </select>
            {fieldError('location')}
          </label>

          <label>
            Available Quantity *
            <input
              type="number"
              min="0"
              step="1"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
              aria-invalid={!!errors.quantity}
            />
            {fieldError('quantity')}
          </label>

          <label>
            Reorder Level *
            <input
              type="number"
              min="0"
              step="1"
              name="reorder"
              value={form.reorder}
              onChange={handleChange}
              placeholder="Enter reorder level"
              required
              aria-invalid={!!errors.reorder}
            />
            {fieldError('reorder')}
          </label>

          <label>
            Supplier
            <input
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="Supplier name (optional)"
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : editItem
                ? 'Save Changes'
                : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItem
