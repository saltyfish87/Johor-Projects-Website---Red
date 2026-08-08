import React from "react";

export function ProjectSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden"
        >
          {/* Cover Image Placeholder */}
          <div className="relative h-64 bg-slate-200">
            <div className="absolute top-4 left-4 h-6 w-36 bg-slate-300 rounded-full" />
            <div className="absolute top-4 right-4 h-8 w-8 bg-slate-300 rounded-lg" />
          </div>

          {/* Content Area */}
          <div className="p-6 flex flex-col flex-1 space-y-4">
            {/* Title & Location */}
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
              <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
            </div>

            {/* Price Tag */}
            <div className="h-7 w-2/5 bg-slate-300 rounded-lg" />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100">
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
              <div className="h-10 w-28 bg-slate-300 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden"
        >
          {/* Blog Image */}
          <div className="h-48 bg-slate-200" />

          {/* Content */}
          <div className="p-6 flex flex-col flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-20 bg-slate-200 rounded-full" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-5/6 bg-slate-300 rounded-md" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-4/5 bg-slate-200 rounded" />
            <div className="pt-4 mt-auto border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
