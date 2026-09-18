import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  DollarSign,
  Briefcase,
  Building2,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  LayoutGrid,
  List,
  Eye,
  Download,
  ShieldAlert,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles
} from 'lucide-react';

const DEPARTMENTS = ['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'IT'];
const STATUSES = ['All', 'Active', 'On Leave', 'Terminated'];

const EmployeeManager = ({ isAddModalOpenFromParent, onCloseParentAddModal }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Alert banner
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', text: '' }

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  // Detail View Modal State
  const [viewingEmp, setViewingEmp] = useState(null);

  // Delete Modal State
  const [deletingEmp, setDeletingEmp] = useState(null);

  useEffect(() => {
    if (isAddModalOpenFromParent) {
      openCreateModal();
      if (onCloseParentAddModal) onCloseParentAddModal();
    }
  }, [isAddModalOpenFromParent]);

  const allDepartments = Array.from(
    new Set(['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'IT', ...employees.map((e) => e.department).filter(Boolean)])
  );

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees', {
        params: {
          search: search.trim() || undefined,
          department: selectedDept !== 'All' ? selectedDept : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
        },
      });
      setEmployees(res.data);
      setCurrentPage(1); // Reset to page 1 on fetch
    } catch (err) {
      console.error('Failed to load employees', err);
      showAlert('error', err.response?.data?.message || 'Failed to fetch employees list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedDept, selectedStatus, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 5000);
  };

  // Sort Employees Logic
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === 'name-asc') return (a.fullName || '').localeCompare(b.fullName || '');
    if (sortBy === 'name-desc') return (b.fullName || '').localeCompare(a.fullName || '');
    if (sortBy === 'salary-desc') return (b.salary || 0) - (a.salary || 0);
    if (sortBy === 'salary-asc') return (a.salary || 0) - (b.salary || 0);
    if (sortBy === 'hireDate-desc') return new Date(b.hireDate || 0) - new Date(a.hireDate || 0);
    if (sortBy === 'hireDate-asc') return new Date(a.hireDate || 0) - new Date(b.hireDate || 0);
    return 0;
  });

  // Pagination Slice
  const totalRecords = sortedEmployees.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + pageSize);

  // Quick Directory Telemetry Metrics
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const totalPayrollBudget = employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);

  const openCreateModal = () => {
    setEditingEmp(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      position: '',
      salary: '',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      status: emp.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary) || 0,
      };

      if (editingEmp) {
        const res = await api.put(`/employees/${editingEmp.id}`, payload);
        showAlert('success', `Employee "${res.data.fullName}" updated successfully!`);
      } else {
        const res = await api.post('/employees', payload);
        showAlert('success', `New employee "${res.data.fullName}" registered successfully!`);
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to save employee', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.Email?.[0] || 'An error occurred while saving.';
      showAlert('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmp) return;
    try {
      await api.delete(`/employees/${deletingEmp.id}`);
      showAlert('success', `Employee record for "${deletingEmp.fullName}" was deleted.`);
      setDeletingEmp(null);
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed', err);
      showAlert('error', err.response?.data?.message || 'Failed to delete employee record.');
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/employees/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_directory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('success', 'Employee directory exported to CSV successfully!');
    } catch (err) {
      console.error('CSV Export failed', err);
      showAlert('error', 'Failed to export employee directory CSV.');
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const getInitials = (firstName, lastName) => {
    const f = firstName ? firstName[0] : '';
    const l = lastName ? lastName[0] : '';
    return (f + l).toUpperCase() || 'EM';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge-status-active';
      case 'on leave':
        return 'badge-status-leave';
      case 'terminated':
        return 'badge-status-terminated';
      default:
        return 'badge-status-default';
    }
  };

  return (
    <div className="employee-manager-container">
      {/* Alert Notification Toast */}
      {alert && (
        <div className={`toast-alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.text}</span>
          <button className="toast-close" onClick={() => setAlert(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Directory Telemetry Quick Summary Bar */}
      <div className="directory-summary-bar">
        <div className="summary-stat-item">
          <span className="stat-label">Total Records</span>
          <span className="stat-value">{totalRecords} Staff</span>
        </div>
        <div className="summary-stat-divider" />
        <div className="summary-stat-item">
          <span className="stat-label">Active Headcount</span>
          <span className="stat-value text-emerald">{activeCount} Active</span>
        </div>
        <div className="summary-stat-divider" />
        <div className="summary-stat-item">
          <span className="stat-label">Total Annual Budget</span>
          <span className="stat-value text-purple">{formatCurrency(totalPayrollBudget)}</span>
        </div>
      </div>

      {/* Directory Action Header */}
      <div className="directory-header">
        <div className="header-title-group">
          <h2>Workforce Directory</h2>
          <span className="count-pill">{totalRecords} Records</span>
        </div>

        <div className="header-action-group">
          <button className="btn btn-secondary" onClick={handleExportCsv} title="Export directory to CSV">
            <Download size={16} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="toolbar-card">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, department, or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setSearch('');
                  fetchEmployees();
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-search">
            Search
          </button>
        </form>

        <div className="filter-controls">
          {/* Status Tabs */}
          <div className="status-tabs">
            {STATUSES.map((status) => (
              <button
                key={status}
                className={`status-tab ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Department Select */}
          <div className="dept-select-wrapper">
            <Building2 size={16} className="select-icon" />
            <select
              className="dept-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {allDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control Dropdown */}
          <div className="dept-select-wrapper">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              className="dept-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="salary-desc">Sort: Salary (High to Low)</option>
              <option value="salary-asc">Sort: Salary (Low to High)</option>
              <option value="hireDate-desc">Sort: Hire Date (Newest)</option>
              <option value="hireDate-asc">Sort: Hire Date (Oldest)</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          <button className="btn-icon" onClick={fetchEmployees} title="Refresh Employee List">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Directory Content Area */}
      {loading ? (
        <div className="loading-state-card">
          <div className="spinner-large" />
          <p>Fetching workforce database records...</p>
        </div>
      ) : totalRecords === 0 ? (
        <div className="empty-state-card">
          <Users size={48} className="text-muted" />
          <h3>No Employee Records Found</h3>
          <p>No employee profiles match your selected search criteria or filters.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedDept('All'); setSelectedStatus('All'); setSortBy('name-asc'); }}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="employee-cards-grid">
          {paginatedEmployees.map((emp) => (
            <div key={emp.id} className="employee-card">
              <div className="card-top-row">
                <div className="avatar-circle">{getInitials(emp.firstName, emp.lastName)}</div>
                <span className={`badge-status ${getStatusBadgeClass(emp.status)}`}>
                  {emp.status}
                </span>
              </div>

              <div className="card-body">
                <h3 className="emp-name" onClick={() => setViewingEmp(emp)}>
                  {emp.fullName}
                </h3>
                <p className="emp-position">{emp.position}</p>
                <div className="emp-dept-pill">
                  <Building2 size={14} />
                  <span>{emp.department}</span>
                </div>

                <div className="card-meta">
                  <div className="meta-row">
                    <Mail size={15} className="meta-icon" />
                    <a href={`mailto:${emp.email}`} className="meta-text hover-link">
                      {emp.email}
                    </a>
                  </div>
                  {emp.phone && (
                    <div className="meta-row">
                      <Phone size={15} className="meta-icon" />
                      <a href={`tel:${emp.phone}`} className="meta-text hover-link">
                        {emp.phone}
                      </a>
                    </div>
                  )}
                  <div className="meta-row">
                    <DollarSign size={15} className="meta-icon text-purple" />
                    <span className="meta-text text-purple font-semibold">
                      {formatCurrency(emp.salary)} / yr
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="btn-card-action btn-view"
                  onClick={() => setViewingEmp(emp)}
                  title="View Profile Details"
                >
                  <Eye size={15} />
                  View
                </button>
                <button
                  className="btn-card-action btn-edit"
                  onClick={() => openEditModal(emp)}
                  title="Edit Record"
                >
                  <Edit2 size={15} />
                  Edit
                </button>
                <button
                  className="btn-card-action btn-delete"
                  onClick={() => setDeletingEmp(emp)}
                  title="Delete Record"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-responsive-card">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Annual Salary</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td>
                    <div className="table-user-cell" onClick={() => setViewingEmp(emp)}>
                      <div className="avatar-sm">{getInitials(emp.firstName, emp.lastName)}</div>
                      <div className="user-names">
                        <div className="name-bold">{emp.fullName}</div>
                        <div className="id-sub">ID #{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-dept-tag">{emp.department}</span>
                  </td>
                  <td>{emp.position}</td>
                  <td>
                    <div className="table-contact-cell">
                      <span>{emp.email}</span>
                      {emp.phone && <small>{emp.phone}</small>}
                    </div>
                  </td>
                  <td className="font-semibold text-purple">{formatCurrency(emp.salary)}</td>
                  <td>{formatDate(emp.hireDate)}</td>
                  <td>
                    <span className={`badge-status ${getStatusBadgeClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button className="icon-btn-sm btn-view" onClick={() => setViewingEmp(emp)} title="View Details">
                        <Eye size={15} />
                      </button>
                      <button className="icon-btn-sm btn-edit" onClick={() => openEditModal(emp)} title="Edit Employee">
                        <Edit2 size={15} />
                      </button>
                      <button className="icon-btn-sm btn-delete" onClick={() => setDeletingEmp(emp)} title="Delete Employee">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer Controls */}
      {totalRecords > 0 && (
        <div className="pagination-card">
          <div className="pagination-info">
            Showing <span>{startIndex + 1}</span> to <span>{Math.min(startIndex + pageSize, totalRecords)}</span> of <span>{totalRecords}</span> entries
          </div>

          <div className="pagination-controls">
            <div className="page-size-selector">
              <label>Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>

                <option value={24}>24</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="pagination-buttons">
              <button
                className="page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-num-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingEmp ? 'Edit Employee Profile' : 'Register New Employee'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Sarah"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Jenkins"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah.jenkins@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    className="form-input"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All').map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Job Title / Position *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Annual Salary (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    className="form-input"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. 1200000"
                  />
                </div>
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving Record...' : editingEmp ? 'Update Profile' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL PROFILE MODAL */}
      {viewingEmp && (
        <div className="modal-backdrop" onClick={() => setViewingEmp(null)}>
          <div className="modal-card modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Dossier & Details</h3>
              <button className="modal-close" onClick={() => setViewingEmp(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="profile-card-content">
              <div className="profile-badge-header">
                <div className="avatar-xl">{getInitials(viewingEmp.firstName, viewingEmp.lastName)}</div>
                <div className="profile-title-block">
                  <h2>{viewingEmp.fullName}</h2>
                  <p>{viewingEmp.position}</p>
                  <div className="profile-pills-row">
                    <span className="dept-tag-lg">{viewingEmp.department}</span>
                    <span className={`badge-status ${getStatusBadgeClass(viewingEmp.status)}`}>
                      {viewingEmp.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <div className="item-label">
                    <Mail size={14} /> Email Address
                  </div>
                  <div className="item-value">
                    <a href={`mailto:${viewingEmp.email}`}>{viewingEmp.email}</a>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="item-label">
                    <Phone size={14} /> Phone Contact
                  </div>
                  <div className="item-value">{viewingEmp.phone || 'Not specified'}</div>
                </div>

                <div className="detail-item">
                  <div className="item-label">
                    <DollarSign size={14} /> Annual Compensation
                  </div>
                  <div className="item-value font-bold text-purple">{formatCurrency(viewingEmp.salary)} / year</div>
                </div>

                <div className="detail-item">
                  <div className="item-label">
                    <Calendar size={14} /> Date of Joining
                  </div>
                  <div className="item-value">{formatDate(viewingEmp.hireDate)}</div>
                </div>

                <div className="detail-item">
                  <div className="item-label">Database Record ID</div>
                  <div className="item-value">#{viewingEmp.id}</div>
                </div>

                <div className="detail-item">
                  <div className="item-label">System Audit Status</div>
                  <div className="item-value text-emerald font-semibold">Verified Active</div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handlePrintDossier}>
                  <Printer size={16} /> Print Dossier
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const empToEdit = viewingEmp;
                    setViewingEmp(null);
                    openEditModal(empToEdit);
                  }}
                >
                  <Edit2 size={16} /> Edit Employee
                </button>
                <button className="btn btn-primary" onClick={() => setViewingEmp(null)}>
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingEmp && (
        <div className="modal-backdrop">
          <div className="modal-card modal-delete">
            <div className="delete-icon-wrapper">
              <ShieldAlert size={32} className="text-rose" />
            </div>
            <h3>Delete Employee Record</h3>
            <p>
              Are you sure you want to permanently delete the employee record for{' '}
              <strong>{deletingEmp.fullName}</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeletingEmp(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
