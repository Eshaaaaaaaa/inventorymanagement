
import { useState } from 'react'
import './Inventory.css'

const initialItems = [
  { id: 'INV-1001', name: 'Industrial Filter', category: 'Equipment', location: 'Warehouse A', quantity: 12, reorder: 20, status: 'Low Stock', description: 'Industrial-grade air filtration component.', unit: 'Pieces', reserved: 3 },
  { id: 'INV-1002', name: 'Safety Gloves', category: 'Safety', location: 'Warehouse B', quantity: 0, reorder: 15, status: 'Out of Stock', description: 'Protective industrial safety gloves.', unit: 'Pairs', reserved: 0 },
  { id: 'INV-1003', name: 'Steel Components', category: 'Raw Materials', location: 'Warehouse A', quantity: 8, reorder: 10, status: 'Low Stock', description: 'Steel components for manufacturing.', unit: 'Pieces', reserved: 2 },
  { id: 'INV-1004', name: 'Office Chairs', category: 'Furniture', location: 'Warehouse C', quantity: 45, reorder: 10, status: 'In Stock', description: 'Ergonomic office chairs.', unit: 'Pieces', reserved: 5 },
  { id: 'INV-1005', name: 'Power Cables', category: 'Electrical', location: 'Warehouse B', quantity: 60, reorder: 20, status: 'In Stock', description: 'Industrial electrical power cables.', unit: 'Metres', reserved: 10 },
  { id: 'INV-1006', name: 'Protective Helmets', category: 'Safety', location: 'Warehouse C', quantity: 0, reorder: 12, status: 'Out of Stock', description: 'Protective helmets for warehouse staff.', unit: 'Pieces', reserved: 0 }
]

function Inventory({
  newItems = [],
  updatedItems = [],
  onAddItem,
  onEditItem,
  onStockUpdate
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('name')
  const [selectedItem, setSelectedItem] = useState(null)
  const [adjustMode, setAdjustMode] = useState(false)
  const [adjustment, setAdjustment] = useState('')
  const [adjustmentError, setAdjustmentError] = useState('')
  const [pendingAdjustment, setPendingAdjustment] = useState(null)
  const [activity, setActivity] = useState([])

  const allItems = [
    ...initialItems.map(item =>
      updatedItems.find(updated => updated.id === item.id) || item
    ),
    ...newItems
  ]

  const filteredItems = allItems
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    )
    .filter(item => category === 'All' || item.category === category)
    .filter(item => status === 'All' || item.status === status)
    .sort((a, b) => {
      if (sort === 'quantity') return a.quantity - b.quantity
      return String(a[sort] || '').localeCompare(String(b[sort] || ''))
    })

  const getStatus = (quantity, reorder) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= reorder) return 'Low Stock'
    return 'In Stock'
  }

  const handleAdjustment = (e) => {
    e.preventDefault()

    const amount = Number(adjustment)

    if (
      adjustment.trim() === '' ||
      !Number.isInteger(amount) ||
      amount === 0
    ) {
      setAdjustmentError('Enter a non-zero whole number.')
      return
    }

    if (selectedItem.quantity + amount < 0) {
      setAdjustmentError('Stock quantity cannot become negative.')
      return
    }

    setAdjustmentError('')
    setPendingAdjustment(amount)
  }

  const confirmAdjustment = () => {
    if (pendingAdjustment === null || !selectedItem) return

    const previousQuantity = selectedItem.quantity
    const updatedQuantity = previousQuantity + pendingAdjustment

    const updatedItem = {
      ...selectedItem,
      quantity: updatedQuantity,
      status: getStatus(updatedQuantity, selectedItem.reorder)
    }

    const activityEntry = {
      id: `${Date.now()}-${selectedItem.id}`,
      itemId: selectedItem.id,
      type: pendingAdjustment > 0 ? 'Stock Added' : 'Stock Removed',
      change: pendingAdjustment,
      previous: previousQuantity,
      current: updatedQuantity,
      date: new Date().toLocaleString()
    }

    onStockUpdate?.(updatedItem)

    setSelectedItem(updatedItem)
    setActivity(prev => [activityEntry, ...prev])
    setAdjustment('')
    setAdjustmentError('')
    setAdjustMode(false)
    setPendingAdjustment(null)
  }

  const cancelAdjustment = () => {
    setPendingAdjustment(null)
    setAdjustmentError('')
  }

  const openDetails = (item) => {
    setSelectedItem(item)
    setAdjustMode(false)
    setAdjustment('')
    setAdjustmentError('')
    setPendingAdjustment(null)
  }

  const closeDetails = () => {
    setSelectedItem(null)
    setAdjustMode(false)
    setAdjustment('')
    setAdjustmentError('')
    setPendingAdjustment(null)
  }

  if (selectedItem) {
    const itemActivity = activity.filter(
      entry => entry.itemId === selectedItem.id
    )

    return (
      <section className="inventory-page">
        <button className="view-btn" onClick={closeDetails}>
          ← Back to Inventory
        </button>

        <header className="inventory-header" style={{ marginTop: '25px' }}>
          <div>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.id} · {selectedItem.category}</p>
          </div>

          <span className={`inventory-status ${selectedItem.status.toLowerCase().replaceAll(' ', '-')}`}>
            {selectedItem.status}
          </span>
        </header>

        <section className="inventory-card">
          <h3>Item Information</h3>
          <p>{selectedItem.description || 'No description provided.'}</p>

          <div className="content-grid" style={{ marginTop: '25px' }}>
            <div className="panel">
              <h3>Stock Information</h3>
              <p>Available Quantity</p>
              <h1>{selectedItem.quantity} {selectedItem.unit || 'Units'}</h1>

              <p style={{ marginTop: '15px' }}>
                Reserved Quantity: {selectedItem.reserved || 0}
              </p>

              <p style={{ marginTop: '10px' }}>
                Reorder Level: {selectedItem.reorder}
              </p>
            </div>

            <div className="panel">
              <h3>Storage Location</h3>
              <h2 style={{ marginTop: '20px' }}>{selectedItem.location}</h2>

              <p style={{ marginTop: '10px' }}>
                Category: {selectedItem.category}
              </p>

              <p style={{ marginTop: '10px' }}>
                Unit: {selectedItem.unit || 'Units'}
              </p>
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>Stock Activity</h3>

          {itemActivity.length > 0 ? (
            itemActivity.map(entry => (
              <div className="attention-item" key={entry.id}>
                <div>
                  <strong>{entry.type}</strong>
                  <small>
                    {entry.date} · {entry.previous} → {entry.current}
                  </small>
                </div>

                <strong>
                  {entry.change > 0 ? '+' : ''}{entry.change}
                </strong>
              </div>
            ))
          ) : (
            <p className="empty-message">
              No stock movements recorded during this session.
            </p>
          )}

          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setAdjustMode(!adjustMode)
                setPendingAdjustment(null)
                setAdjustmentError('')
              }}
            >
              Adjust Stock
            </button>

            <button
              className="add-btn"
              onClick={() => onEditItem?.(selectedItem)}
            >
              Edit Item
            </button>
          </div>

          {adjustMode && (
            <form onSubmit={handleAdjustment} style={{ marginTop: '20px' }}>
              <label>
                Stock Adjustment (+ to add, - to remove)

                <input
                  type="number"
                  step="1"
                  value={adjustment}
                  onChange={e => {
                    setAdjustment(e.target.value)
                    setAdjustmentError('')
                  }}
                  placeholder="Example: 10 or -5"
                  aria-invalid={!!adjustmentError}
                  required
                />
              </label>

              {adjustmentError && (
                <p className="field-error" role="alert">
                  {adjustmentError}
                </p>
              )}

              {pendingAdjustment === null ? (
                <button
                  className="add-btn"
                  type="submit"
                  style={{ marginTop: '15px' }}
                >
                  Review Adjustment
                </button>
              ) : (
                <div style={{ marginTop: '18px' }}>
                  <p>
                    Confirm changing stock from {selectedItem.quantity} to{' '}
                    {selectedItem.quantity + pendingAdjustment}?
                  </p>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={cancelAdjustment}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="add-btn"
                      onClick={confirmAdjustment}
                    >
                      Confirm Adjustment
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </section>
      </section>
    )
  }

  return (
    <section className="inventory-page">
      <header className="inventory-header">
        <div>
          <h2>Inventory</h2>
          <p>Manage and monitor all your inventory items.</p>
        </div>

        <button className="add-btn" onClick={onAddItem}>
          + Add New Item
        </button>
      </header>

      <section className="inventory-card">
        <div className="inventory-toolbar">
          <input
            type="text"
            aria-label="Search inventory by item name or ID"
            placeholder="Search by item name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            aria-label="Filter by category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option>Equipment</option>
            <option>Safety</option>
            <option>Raw Materials</option>
            <option>Furniture</option>
            <option>Electrical</option>
          </select>

          <select
            aria-label="Filter by stock status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          <select
            aria-label="Sort inventory"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="id">Sort by Item ID</option>
          </select>
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{item.quantity} {item.unit || ''}</td>
                  <td>{item.reorder}</td>

                  <td>
                    <span className={`inventory-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openDetails(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">
                    No inventory items found. Try changing your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="item-count">
          Showing {filteredItems.length} of {allItems.length} items
        </p>
      </section>
    </section>
  )
}

export default Inventory
