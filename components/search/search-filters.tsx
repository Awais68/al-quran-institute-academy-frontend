"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface SearchableItem {
  id: string;
  name: string;
  email: string;
  course?: string;
  role?: string;
  status?: string;
  feeStatus?: string;
  [key: string]: any;
}

interface SearchFiltersProps {
  data: SearchableItem[];
  onResultsChange: (results: SearchableItem[]) => void;
  searchKeys?: string[];
  placeholder?: string;
  showFilters?: {
    course?: boolean;
    status?: boolean;
    feeStatus?: boolean;
    role?: boolean;
  };
}

export default function SearchFilters({
  data,
  onResultsChange,
  searchKeys = ["name", "email", "course"],
  placeholder = "Search students...",
  showFilters = {
    course: true,
    status: true,
    feeStatus: true,
    role: false
  }
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    course: "all",
    status: "all",
    feeStatus: "all",
    role: "all"
  });

  // Configure Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: searchKeys,
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2
    });
  }, [data, searchKeys]);

  useEffect(() => {
    applySearchAndFilters();
  }, [searchQuery, filters, data]);

  const applySearchAndFilters = () => {
    let results = data;

    // Apply search
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map(result => result.item);
    }

    // Apply filters
    results = results.filter(item => {
      if (filters.course !== "all" && item.course !== filters.course) return false;
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.feeStatus !== "all" && item.feeStatus !== filters.feeStatus) return false;
      if (filters.role !== "all" && item.role !== filters.role) return false;
      return true;
    });

    onResultsChange(results);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      course: "all",
      status: "all",
      feeStatus: "all",
      role: "all"
    });
  };

  const hasActiveFilters = 
    searchQuery || 
    filters.course !== "all" || 
    filters.status !== "all" || 
    filters.feeStatus !== "all" ||
    filters.role !== "all";

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-4"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {showFilters.course && (
            <Select
              value={filters.course}
              onValueChange={(value) => setFilters({ ...filters, course: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Qaida">Qaida</SelectItem>
                <SelectItem value="Tajweed">Tajweed</SelectItem>
                <SelectItem value="Nazra">Nazra</SelectItem>
                <SelectItem value="Hifz">Hifz</SelectItem>
                <SelectItem value="Namaz">Namaz</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showFilters.status && (
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showFilters.feeStatus && (
            <Select
              value={filters.feeStatus}
              onValueChange={(value) => setFilters({ ...filters, feeStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Fee Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fee Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showFilters.role && (
            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({ ...filters, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filters.course !== "all" && (
                <Badge variant="secondary">
                  Course: {filters.course}
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="secondary">
                  Status: {filters.status}
                </Badge>
              )}
              {filters.feeStatus !== "all" && (
                <Badge variant="secondary">
                  Fee: {filters.feeStatus}
                </Badge>
              )}
              {filters.role !== "all" && (
                <Badge variant="secondary">
                  Role: {filters.role}
                </Badge>
              )}
            </div>
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
