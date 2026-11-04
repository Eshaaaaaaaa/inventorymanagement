
import { useEffect, useState } from 'react'
import './App.css'
import Inventory from './InventoryPage.jsx'
import AddItem from './AddItem.jsx'

const initialItems = [
  { id: 'INV-1001', name: 'Industrial Filter', category: 'Equipment', location: 'Warehouse A', quantity: 12, reorder: 20, status: 'Low Stock' },
  { id: 'INV-1002', name: 'Safety Gloves', category: 'Safety', location: 'Warehouse B', quantity: 0, reorder: 15, status: 'Out of Stock' },
  { id: 'INV-1003', name: 'Steel Components', category: 'Raw Materials', location: 'Warehouse A', quantity: 8, reorder: 10, status: 'Low Stock' },
  { id: 'INV-1004', name: 'Office Chairs', category: 'Furniture', location: 'Warehouse C', quantity: 45, reorder: 10, status: 'In Stock' },
  { id: 'INV-1005', name: 'Power Cables', category: 'Electrical', location: 'Warehouse B', quantity: 60, reorder: 20, status: 'In Stock' },
  { id: 'INV-1006', name: 'Protective Helmets', category: 'Safety', location: 'Warehouse C', quantity: 0, reorder: 12, status: 'Out of Stock' }
]

function App() {
  const demoState = new URLSearchParams(window.location.search).get('demoState')
  const [workspaceState, setWorkspaceState] = useState(demoState === 'error' ? 'error' : 'loading')

  useEffect(() => {
    if (demoState === 'error' || demoState === 'loading') return
    const timer = window.setTimeout(() => setWorkspaceState('ready'), 550)
    return () => window.clearTimeout(timer)
  }, [demoState])

  const [page, setPage] = useState('Overview')
  const [newItems, setNewItems] = useState([])
  const [updatedItems, setUpdatedItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [notification, setNotification] = useState('')

  const allItems = [
    ...initialItems.map(item =>
      updatedItems.find(updated => updated.id === item.id) || item
    ),
    ...newItems
  ]

  const totalItems = allItems.length
  const inStock = allItems.filter(item => item.status === 'In Stock').length
  const lowStock = allItems.filter(item => item.status === 'Low Stock').length
  const outOfStock = allItems.filter(item => item.status === 'Out of Stock').length
  const attentionCount = lowStock + outOfStock

  const getPercentage = (count) =>
    totalItems === 0 ? 0 : Math.round((count / totalItems) * 100)

  const stockSummary = [
    ['In Stock', inStock, 'bar'],
    ['Low Stock', lowStock, 'bar warning'],
    ['Out of Stock', outOfStock, 'bar danger']
  ]

  const attentionItems = allItems.filter(
    item => item.status !== 'In Stock'
  )

  const handleSave = (form) => {
    const quantity = Number(form.quantity)
    const reorder = Number(form.reorder)

    const updatedItem = {
      ...form,
      quantity,
      reorder,
      status: quantity === 0
        ? 'Out of Stock'
        : quantity <= reorder
          ? 'Low Stock'
          : 'In Stock'
    }

    if (editingItem) {
      const isNewItem = newItems.some(
        item => item.id === editingItem.id
      )

      if (isNewItem) {
        setNewItems(prev =>
          prev.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
        )
      } else {
        setUpdatedItems(prev => [
          ...prev.filter(item => item.id !== editingItem.id),
          updatedItem
        ])
      }

      setNotification('Item updated successfully.')
      setEditingItem(null)
    } else {
      setNewItems(prev => [...prev, updatedItem])
      setNotification('New item added successfully.')
    }

    setPage('Inventory')
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setNotification('')
    setPage('Edit Item')
  }

  const handleStockUpdate = (updatedItem) => {
    const isNewItem = newItems.some(
      item => item.id === updatedItem.id
    )

    if (isNewItem) {
      setNewItems(prev =>
        prev.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        )
      )
    } else {
      setUpdatedItems(prev => [
        ...prev.filter(item => item.id !== updatedItem.id),
        updatedItem
      ])
    }

    setNotification('Stock adjusted successfully.')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setNotification('')
    setPage('Inventory')
  }

  const openAddItem = () => {
    setEditingItem(null)
    setNotification('')
    setPage('Add Item')
  }

  const retryLoad = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('demoState')
    window.history.replaceState({}, '', url)
    setWorkspaceState('loading')
    window.setTimeout(() => setWorkspaceState('ready'), 550)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>INVENTORY<span>.</span></h2>
        <p className="nav-label">MAIN MENU</p>

        <nav>
          <button
            className={page === 'Overview' ? 'active' : ''}
            onClick={() => setPage('Overview')}
          >
            ▦ Overview
          </button>

          <button
            className={page === 'Inventory' ? 'active' : ''}
            onClick={() => setPage('Inventory')}
          >
            ▤ Inventory
          </button>

          <button
            className={page === 'Add Item' || page === 'Edit Item' ? 'active' : ''}
            onClick={openAddItem}
          >
            ＋ Add Item
          </button>
        </nav>
      </aside>

      <main className="main">
        {workspaceState === 'loading' && <WorkspaceLoading />}
        {workspaceState === 'error' && <WorkspaceError onRetry={retryLoad} />}

        {workspaceState === 'ready' && notification && (
          <div className="success-notification" role="status">
            <span>✓ {notification}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotification('')}
            >
              ×
            </button>
          </div>
        )}

        {workspaceState === 'ready' && page === 'Overview' && (
          <>
            <header className="topbar">
              <div>
                <h2>Overview</h2>
                <p>Welcome back! Here's your inventory summary.</p>
              </div>

              <button className="add-btn" onClick={openAddItem}>
                + Add New Item
              </button>
            </header>

            <section className="stats">
              {[
                ['Total Items', totalItems, 'Across all locations'],
                ['In Stock', inStock, 'Healthy inventory'],
                ['Low Stock', lowStock, 'Needs attention'],
                ['Out of Stock', outOfStock, 'Restocking required'],
                ['Items Requiring Attention', attentionCount, 'Restocking action needed']
              ].map(([title, value, description]) => (
                <div className="stat-card" key={title}>
                  <p>{title}</p>
                  <h1>{value}</h1>
                  <small>{description}</small>
                </div>
              ))}
            </section>

            <section className="content-grid">
              <div className="panel">
                <h3>Inventory Overview</h3>
                <p>Stock distribution</p>

                {stockSummary.map(([label, count, style]) => {
                  const percentage = getPercentage(count)

                  return (
                    <div className="stock-row" key={label}>
                      <span>{label}</span>
                      <strong>{percentage}%</strong>
                      <div className={style}>
                        <div style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="panel">
                <h3>Items Requiring Attention</h3>

                {attentionItems.length > 0 ? (
                  attentionItems.map(item => (
                    <div className="attention-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.id}</small>
                      </div>
                      <span className={item.status === 'Low Stock' ? 'low' : 'out'}>
                        {item.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>All inventory items are sufficiently stocked.</p>
                )}
              </div>
            </section>
          </>
        )}

        {workspaceState === 'ready' && page === 'Inventory' && (
          <Inventory
            newItems={newItems}
            updatedItems={updatedItems}
            onAddItem={openAddItem}
            onEditItem={handleEdit}
            onStockUpdate={handleStockUpdate}
          />
        )}

        {workspaceState === 'ready' && (page === 'Add Item' || page === 'Edit Item') && (
          <AddItem
            key={editingItem ? editingItem.id : 'new-item'}
            editItem={editingItem}
            existingItems={allItems}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  )
}

function WorkspaceLoading() {
  return (
    <section className="workspace-state workspace-loading" role="status" aria-live="polite" aria-label="Loading inventory workspace">
      <div className="loading-title"><i /><i /></div>
      <div className="loading-stat-grid">{[1, 2, 3, 4].map(card => <i key={card} />)}</div>
      <div className="loading-panels"><i /><i /></div>
      <span>Loading your inventory…</span>
    </section>
  )
}

function WorkspaceError({ onRetry }) {
  return (
    <section className="workspace-state workspace-error" role="alert">
      <div className="error-mark" aria-hidden="true">!</div>
      <h2>We couldn’t load your inventory</h2>
      <p>Something interrupted the inventory data load. Your saved items haven’t been changed.</p>
      <button className="add-btn" onClick={onRetry}>Try again</button>
      <small>This is a simulated error state for the frontend demo.</small>
    </section>
  )
}

export default App
