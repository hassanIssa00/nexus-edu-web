'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, ShieldCheck, AlertTriangle, RefreshCw,
  ExternalLink, School, User, CheckCircle2, X, Compass, Loader2
} from 'lucide-react'
import {
  getSchoolLocation, checkLocationWithinSchool, getCurrentBrowserPosition,
  SchoolLocationConfig, GeofenceResult
} from '@/lib/schoolLocation'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (method: string, coords: { lat: number; lng: number }) => void
  method: string // 'FACE_ID' | 'QR_SCAN'
}

export default function InteractiveGeofenceModal({
  isOpen,
  onClose,
  onSuccess,
  method,
}: Props) {
  const [school] = useState<SchoolLocationConfig>(() => getSchoolLocation())
  const [geoStatus, setGeoStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking')
  const [geoErrorMsg, setGeoErrorMsg] = useState<string>('')
  const [studentCoords, setStudentCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const verifyGPS = useCallback(async () => {
    setGeoStatus('checking')
    setGeoErrorMsg('')
    try {
      const pos = await getCurrentBrowserPosition()
      setStudentCoords({ lat: pos.lat, lng: pos.lng })
      const result = checkLocationWithinSchool(pos.lat, pos.lng)
      setGeofenceResult(result)

      if (result.isWithin) {
        setGeoStatus('allowed')
      } else {
        setGeoStatus('denied')
        setGeoErrorMsg(`أنت تبعد مسافة (${result.distanceText}) عن المدرسة. الحد الأقصى المسموح به هو ${result.allowedRadius} متر داخل الحرم المدرسي.`)
      }
    } catch (err: any) {
      setGeoStatus('error')
      setGeoErrorMsg(err?.message || 'تعذر تحديد موقع جهازك الجغرافي. يرجى تفعيل إذن الـ GPS.')
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      verifyGPS()
    }
  }, [isOpen, verifyGPS])

  if (!isOpen) return null

  const isWithin = geofenceResult?.isWithin ?? false
  const distanceText = geofenceResult?.distanceText ?? '--'

  const mapEmbedUrl = studentCoords
    ? `https://maps.google.com/maps?saddr=${studentCoords.lat},${studentCoords.lng}&daddr=${school.lat},${school.lng}&hl=ar&output=embed`
    : `https://maps.google.com/maps?q=${school.lat},${school.lng}&hl=ar&z=17&output=embed`

  const handleConfirm = () => {
    if (!isWithin || !studentCoords) return
    setSubmitting(true)
    setTimeout(() => {
      onSuccess(method, studentCoords)
      setSubmitting(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 text-white relative overflow-hidden ${
          geoStatus === 'checking'
            ? 'bg-gradient-to-r from-sky-600 to-indigo-600'
            : isWithin
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
            : 'bg-gradient-to-r from-rose-600 to-red-700'
        }`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                {geoStatus === 'checking' ? '🛰️' : isWithin ? '📍' : '⛔'}
              </div>
              <div>
                <h3 className="text-base font-black">التحقق من النطاق الجغرافي المدرسي</h3>
                <p className="text-xs text-white/80 mt-0.5">{school.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Status Alert */}
          {geoStatus === 'checking' && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 text-sky-800 dark:text-sky-300">
              <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
              <div>
                <p className="text-xs font-black">جاري قياس موقعك الفعلي بدقة عبر الأقمار الصناعية (GPS)...</p>
                <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-0.5">يُشترط التواجد الفعلي داخل الحرم المدرسي لتسجيل الحضور</p>
              </div>
            </div>
          )}

          {geoStatus === 'allowed' && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black">أنت متواجد داخل المدرسة بنجاح! ✅</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  المسافة عن مبنى المدرسة: <span className="font-bold underline">{distanceText}</span> (المسموح حتى {school.radiusMeters} متر).
                </p>
              </div>
            </div>
          )}

          {(geoStatus === 'denied' || geoStatus === 'error') && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-xs font-black">تم رفض التسجيل: خارج حدود المدرسة ⛔</p>
                <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5 leading-relaxed">
                  {geoErrorMsg}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 h-48 relative shadow-inner">
            <iframe
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              title="موقع المدرسة والطالب"
              loading="lazy"
            />
            {studentCoords && (
              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-mono">
                {studentCoords.lat.toFixed(5)}, {studentCoords.lng.toFixed(5)}
              </div>
            )}
          </div>

          {/* Footer details */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-teal-600" />
              جدة — حي الصفا
            </span>
            <button
              onClick={verifyGPS}
              disabled={geoStatus === 'checking'}
              className="flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${geoStatus === 'checking' ? 'animate-spin' : ''}`} />
              إعادة فحص الموقع
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            إلغاء
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isWithin || submitting || geoStatus !== 'allowed'}
            className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            تأكيد تسجيل الحضور الآن
          </button>
        </div>
      </motion.div>
    </div>
  )
}
