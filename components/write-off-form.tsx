'use client'

import { createWriteOff } from '@/app/actions/write-offs'
import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

const OUTLETS = [
  'Точка №1 — Центр', 'Точка №2 — Север', 'Точка №3 — Юг',
  'Точка №4 — Запад', 'Точка №5 — Восток',
]

const EMPLOYEES = [
  'Иванов Иван', 'Петрова Мария', 'Сидоров Алексей',
  'Кузнецова Елена', 'Смирнов Дмитрий',
]

export function WriteOffForm() {
  const [outletName, setOutletName] = useState('')
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deductionType, setDeductionType] = useState<'no_deduction' | 'with_deduction'>('no_deduction')
  const [deductedEmployeeName, setDeductedEmployeeName] = useState('')
  const [reason, setReason] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setPhotoUrl(data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (reason.length < 10) { setError('Комментарий минимум 10 символов'); return }
    if (deductionType === 'with_deduction' && !deductedEmployeeName) { setError('Выберите сотрудника'); return }
    setError('')
    setSubmitting(true)
    try {
      await createWriteOff({
        outletName, productName, quantity, deductionType,
        deductedEmployeeName: deductionType === 'with_deduction' ? deductedEmployeeName : undefined,
        reason, photoUrl: photoUrl || undefined,
      })
      setSuccess(true)
      setOutletName(''); setProductName(''); setQuantity(1)
      setDeductionType('no_deduction'); setDeductedEmployeeName('')
      setReason(''); setPhotoUrl(''); setPhotoPreview('')
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Ошибка при отправке')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium dark:bg-green-500/15 dark:border-green-500/25 dark:text-green-300">
          Заявка отправлена на проверку
        </div>
      )}

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium mb-2">Фото продукции</label>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        {photoPreview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
            <Image src={photoPreview} alt="Фото" fill className="object-cover" />
            <button type="button" onClick={() => { setPhotoPreview(''); setPhotoUrl('') }}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Camera size={28} />
            <span className="text-sm">{uploading ? 'Загрузка...' : 'Прикрепить фото'}</span>
          </button>
        )}
      </div>

      {/* Outlet */}
      <div>
        <label className="block text-sm font-medium mb-2">Торговая точка <span className="text-destructive">*</span></label>
        <select required value={outletName} onChange={e => setOutletName(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Выберите точку</option>
          {OUTLETS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm font-medium mb-2">Продукт <span className="text-destructive">*</span></label>
        <input required value={productName} onChange={e => setProductName(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Например: котлета, булочка, томат..." />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-2">Количество <span className="text-destructive">*</span></label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-12 h-12 rounded-lg border border-border text-xl font-bold flex items-center justify-center">−</button>
          <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
          <button type="button" onClick={() => setQuantity(q => q + 1)}
            className="w-12 h-12 rounded-lg border border-border text-xl font-bold flex items-center justify-center">+</button>
        </div>
      </div>

      {/* Deduction type */}
      <div>
        <label className="block text-sm font-medium mb-2">Тип списания <span className="text-destructive">*</span></label>
        <div className="grid grid-cols-2 gap-2">
          {(['no_deduction', 'with_deduction'] as const).map(type => (
            <button key={type} type="button" onClick={() => setDeductionType(type)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                deductionType === type
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border text-foreground'
              }`}>
              {type === 'no_deduction' ? 'Без удержания' : 'С удержанием'}
            </button>
          ))}
        </div>
      </div>

      {/* Employee (only for with_deduction) */}
      {deductionType === 'with_deduction' && (
        <div>
          <label className="block text-sm font-medium mb-2">Сотрудник <span className="text-destructive">*</span></label>
          <select value={deductedEmployeeName} onChange={e => setDeductedEmployeeName(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Выберите сотрудника</option>
            {EMPLOYEES.map(emp => <option key={emp}>{emp}</option>)}
          </select>
        </div>
      )}

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Комментарий <span className="text-destructive">*</span>
          <span className="text-muted-foreground font-normal ml-1">(мин. 10 символов)</span>
        </label>
        <textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3}
          className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Опишите причину списания..." />
        <p className="text-xs text-muted-foreground mt-1">{reason.length} / 10+</p>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <button type="submit" disabled={submitting || uploading}
        className="w-full bg-primary text-primary-foreground rounded-xl py-4 text-base font-semibold disabled:opacity-50">
        {submitting ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  )
}
