"use client";
import { ChevronRight, CirclePlus, Loader2, X, Car } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTaxis } from "@/hooks/useTaxis";
import { ITaxi } from "@/types/ITaxi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaxiCardProps {
  data: ITaxi;
  onEdit: (taxi: ITaxi) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: ITaxi["status"]) => void;
}

const TaxiCard = ({ data, onEdit, onDelete, onToggleStatus }: TaxiCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCarTypeLabel = (carType: ITaxi["car_type"]) => {
    const labels: Record<ITaxi["car_type"], string> = {
      standard_sedan: "Standard Sedan",
      premium_sedan: "Premium Sedan",
      suv: "SUV",
      mini_bus: "Mini Bus",
    };
    return labels[carType];
  };

  const StatusBadge = ({ status }: { status: ITaxi["status"] }) => {
    const isActive = status === "active";
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
          }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {data.image ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden">
              <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 flex items-center justify-center bg-[#FFF0EE] rounded-xl">
              <Car className="w-7 h-7 text-[#781F19]" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            <p className="text-sm text-gray-500">{getCarTypeLabel(data.car_type)}</p>
          </div>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Price</p>
          <p className="text-lg font-bold text-[#781F19]">€{data.price}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Passengers</p>
          <p className="text-lg font-bold text-gray-800">{data.passenger_seats}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Luggage</p>
          <p className="text-lg font-bold text-gray-800">{data.luggage_quantity}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Carry-on</p>
          <p className="text-lg font-bold text-gray-800">{data.carry_on_luggage}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(data.uid, data.status === "active" ? "closed" : "active")}
        >
          {data.status === "active" ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(data)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(data.uid)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

interface TaxiFormData {
  name: string;
  car_type: ITaxi["car_type"];
  price: number;
  passenger_seats: number;
  luggage_quantity: number;
  carry_on_luggage: number;
  status: ITaxi["status"];
}

const initialFormData: TaxiFormData = {
  name: "",
  car_type: "standard_sedan",
  price: 100,
  passenger_seats: 4,
  luggage_quantity: 2,
  carry_on_luggage: 2,
  status: "active",
};

const TaxisPage = () => {
  const {
    taxis,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    fetchTaxis,
    addTaxi,
    updateTaxi,
    deleteTaxi,
    uploadTaxiImage,
  } = useTaxis();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [carTypeFilter, setCarTypeFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxi, setEditingTaxi] = useState<ITaxi | null>(null);
  const [formData, setFormData] = useState<TaxiFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchTaxis({
      page,
      status: statusFilter === "all" ? undefined : statusFilter,
      car_type: carTypeFilter === "all" ? undefined : (carTypeFilter as ITaxi["car_type"]),
    });
  }, [fetchTaxis, page, statusFilter, carTypeFilter]);

  const handleOpenModal = (taxi?: ITaxi) => {
    if (taxi) {
      setEditingTaxi(taxi);
      setFormData({
        name: taxi.name,
        car_type: taxi.car_type,
        price: taxi.price,
        passenger_seats: taxi.passenger_seats,
        luggage_quantity: taxi.luggage_quantity,
        carry_on_luggage: taxi.carry_on_luggage,
        status: taxi.status,
      });
      setImagePreview(taxi.image || null);
    } else {
      setEditingTaxi(null);
      setFormData(initialFormData);
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTaxi(null);
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        imageUrl = await uploadTaxiImage(imageFile);
      }

      const taxiData = {
        ...formData,
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      if (editingTaxi) {
        await updateTaxi(editingTaxi.uid, taxiData);
      } else {
        await addTaxi(taxiData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving taxi:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this taxi?")) {
      await deleteTaxi(id);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: ITaxi["status"]) => {
    await updateTaxi(id, { status: newStatus });
  };

  return (
    <div className="w-full mx-auto pt-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Taxis</h2>
          <p className="flex items-center gap-2 text-gray-500">
            <a href="/" className="hover:underline">
              Management
            </a>{" "}
            <ChevronRight size={16} /> Taxis <ChevronRight size={16} />
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as "all" | "active" | "closed");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Car Type Filter */}
          <Select
            value={carTypeFilter}
            onValueChange={(val) => {
              setCarTypeFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Car Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard_sedan">Standard Sedan</SelectItem>
              <SelectItem value="premium_sedan">Premium Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="mini_bus">Mini Bus</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-[#781F19] text-white flex items-center gap-2"
            onClick={() => handleOpenModal()}
          >
            Add Taxi <CirclePlus size={20} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">Error: {error}</div>
        ) : taxis.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No taxis found. Add your first taxi to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {taxis.map((taxi) => (
              <TaxiCard
                key={taxi.uid}
                data={taxi}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6 mb-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingTaxi ? "Edit Taxi" : "Add New Taxi"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Taxi Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter taxi name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="car_type">Car Type</Label>
                <Select
                  value={formData.car_type}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      car_type: val as ITaxi["car_type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard_sedan">Standard Sedan</SelectItem>
                    <SelectItem value="premium_sedan">Premium Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="mini_bus">Mini Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="passenger_seats">Passengers</Label>
                  <Input
                    id="passenger_seats"
                    type="number"
                    min="1"
                    value={formData.passenger_seats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passenger_seats: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="luggage_quantity">Luggage</Label>
                  <Input
                    id="luggage_quantity"
                    type="number"
                    min="0"
                    value={formData.luggage_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        luggage_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="carry_on_luggage">Carry-on</Label>
                  <Input
                    id="carry_on_luggage"
                    type="number"
                    min="0"
                    value={formData.carry_on_luggage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        carry_on_luggage: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      status: val as ITaxi["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxi-image">Car Image</Label>
                <Input
                  id="taxi-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="mt-1"
                />
                {imagePreview && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#781F19] text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingTaxi ? "Update Taxi" : "Add Taxi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxisPage;
