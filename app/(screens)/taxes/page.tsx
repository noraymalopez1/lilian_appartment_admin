"use client";

import React, { useEffect, useState } from "react";
import { useTaxes } from "@/hooks/useTaxes";
import { ITax } from "@/types/ITax";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Loader2, Plus, Trash2 } from "lucide-react";

export default function TaxesPage() {
  const { taxes, isLoading, fetchTaxes, addTax, updateTax, deleteTax } = useTaxes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTax, setEditingTax] = useState<ITax | null>(null);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this tax?")) return;

    const result = await deleteTax(uid);
    if (result.success) {
      alert("Tax deleted successfully!");
    } else {
      alert(`Failed to delete tax: ${result.error}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-12 px-4 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Default Taxes</h2>
        <p className="flex items-center gap-2 text-gray-600">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Management
          </a>
          <ChevronRight size={16} /> Taxes
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#99582A] hover:bg-[#7d461f] text-white flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Tax
        </Button>
      </div>

      {isLoading && taxes.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#99582A]" />
          <span className="ml-2">Loading taxes...</span>
        </div>
      ) : taxes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No taxes configured yet. Add your first tax.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Application</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applicability</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {taxes.map((tax) => (
                <tr key={tax.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{tax.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tax.type === "percentage" ? `${tax.rate}%` : `$${tax.rate}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">{tax.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tax.per_head ? "Per Person" : "Per Booking"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">{tax.applicability}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingTax(tax)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tax.uid)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <TaxModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            const result = await addTax(data);
            if (result.success) {
              alert("Tax added successfully!");
              setShowAddModal(false);
            } else {
              alert(`Failed to add tax: ${result.error}`);
            }
          }}
        />
      )}

      {editingTax && (
        <TaxModal
          tax={editingTax}
          onClose={() => setEditingTax(null)}
          onSave={async (data) => {
            const result = await updateTax(editingTax.uid, data);
            if (result.success) {
              alert("Tax updated successfully!");
              setEditingTax(null);
            } else {
              alert(`Failed to update tax: ${result.error}`);
            }
          }}
        />
      )}
    </div>
  );
}

interface TaxModalProps {
  tax?: ITax;
  onClose: () => void;
  onSave: (data: Omit<ITax, "uid" | "created_at" | "updated_at">) => Promise<void>;
}

function TaxModal({ tax, onClose, onSave }: TaxModalProps) {
  const [formData, setFormData] = useState({
    name: tax?.name || "",
    rate: tax?.rate || 0,
    type: tax?.type || "percentage",
    per_head: tax?.per_head || false,
    applicability: tax?.applicability || "all",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSave(formData as any);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-2xl font-bold mb-6">{tax ? "Edit Tax" : "Add New Tax"}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VAT, Tourist Tax"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate * {formData.type === "percentage" ? "(%)" : "($)"}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              placeholder={formData.type === "percentage" ? "e.g., 20" : "e.g., 5"}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application *</label>
            <select
              value={formData.per_head ? "per_head" : "per_booking"}
              onChange={(e) => setFormData({ ...formData, per_head: e.target.value === "per_head" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="per_booking">Per Booking</option>
              <option value="per_head">Per Person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicability *</label>
            <select
              value={formData.applicability}
              onChange={(e) => setFormData({ ...formData, applicability: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="apartment">Apartment Only</option>
              <option value="attraction">Attraction Only</option>
              <option value="airport_taxi">Airport Taxi Only</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#99582A] text-white rounded-lg hover:bg-[#7d461f] transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : tax ? "Update Tax" : "Add Tax"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
