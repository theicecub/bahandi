'use client'

import { createWriteOff } from '@/app/actions/write-offs'
import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

const OUTLETS = [
  'Bahandi Шахтеров — Караганда, проспект Шахтеров, 82/3 (киоск)',
  'Bahandi Магнум Жетысу — Алматы, Жетысу-3 микрорайон, 1г/3 (киоск)',
  'Bahandi АДК — Алматы, ул. Каныша Сатпаева, 90/21 (ТРЦ Riviera Park)',
  'Bahandi Сары Арка — Алматы, 4-й микрорайон, 28/1 (рынок Сары Арка)',
  'Bahandi Март — Костанай, проспект Аль-Фараби, 48 (ТРЦ MART, 3 этаж)',
  'Bahandi Каменка — Алматы, ул. Керуентау, 2/1 (1 этаж)',
  'Bahandi Астана Молл — Астана, проспект Тауелсиздик, 34/7 (киоск)',
  'Bahandi Магнум Акбулак — Алматы, Акбулак микрорайон, ул. Байтерекова, 6/1 (1 этаж)',
  'Bahandi Форум — Алматы, проспект Сейфуллина, 617 (киоск)',
  'Bahandi Орбита — Алматы, микрорайон Орбита-3, ул. Мустафина, 5Б/1 (киоск)',
  'Bahandi Север — Шымкент, ул. Рыскулова, 49а (ТЦ Север, 1 этаж)',
  'Bahandi Спутник — Алматы, Мамыр-1 микрорайон, 8а (ТРЦ SPUTNIK mall, 3 этаж)',
  'Bahandi Грин Плаза — Актау, 17-й микрорайон, 6 (ЖК Green Plaza)',
  'Bahandi Апорт Кульджинка — Алматы, Кульджинский тракт, 106 (ТРЦ Aport Mall East)',
  'Bahandi Каскелен — Алматы, г. Каскелен, ул. Абен Омиралы, 99',
  'Bahandi Даму Молл — Астана, ул. Жумекен Нажимеденов, 26 (ТРЦ Damu Mall, 2 этаж)',
  'Bahandi Магнум Гагарина — Алматы, проспект Гагарина, 41 (1 этаж)',
  'Bahandi Тумар — Астана, ул. Сыганак, 1Б/2 (киоск)',
  'Bahandi Татарка — Алматы, ул. Оренбургская, 2 (1 этаж)',
  'Bahandi Масанчи — Алматы, ул. Масанчи, 96 (цокольный этаж)',
  'Bahandi Строителей — Караганда, проспект Строителей, 35 (киоск)',
  'Bahandi Март Тараз — Тараз, проспект Толе би, 27 (ТРЦ Mart, 3 этаж)',
  'Bahandi Жибек Жолы — Астана, ул. Ахмета Байтурсынова, 34 (ТРЦ Жибек Жолы, 3 этаж)',
  'Bahandi Мега Центр Розыбакиева — Алматы, ул. Розыбакиева, 247а (ТРЦ Mega Center Alma-Ata)',
  'Bahandi Атакент — Алматы, ул. Ауэзова, 140 (1 этаж)',
  'Bahandi ЦУМ — Алматы, проспект Абылай хана, 62 (ТД ЦУМ, 1 этаж)',
  'Bahandi Керемет — Шымкент, ул. Байтурсынова, 81 (1 этаж)',
  'Bahandi Масато — Алматы, ул. Ораза Жандосова, 162а',
  'Bahandi Жубанова — Алматы, Аксай-4 микрорайон, 22а/3 (киоск)',
  'Bahandi Дружба — Алматы, ул. Шамгона Кажыгалиева, 22',
  'Bahandi Бесагаш — Алматы, с. Бесагаш, ул. Райымбек батыра, 250/1 (киоск)',
  'Bahandi ГРЭС — Алматы, с. Отеген Батыра, ул. Жансугурова, 15а',
  'Bahandi Кунаева — Алматы, Абая проспект, 27 (киоск)',
  'Bahandi Мангилик Ел — Астана, проспект Мангилик Ел, 56 (ЖК Only Sun)',
  'Bahandi Талгар — Алматы, г. Талгар, ул. Кунаева, 140',
  'Bahandi Торнадо — Алматы, микрорайон 3-й, 20а (1 этаж)',
  'Bahandi ВАЗ — Алматы, ул. Тукая, 28 (1 этаж)',
  'Bahandi Женис — Астана, проспект Женис, 28а (киоск)',
  'Bahandi Сити Молл — Шымкент, проспект Байдибек би, 362/7 (ТРЦ Shymkent City Mall, 3 этаж)',
  'Bahandi Азия Парк — Алматы, проспект Райымбека, 514а (ТРК Asia Park, 3 этаж)',
  'Bahandi Апорт — Алматы, Ташкентский тракт, 17к (ТРЦ Молл Апорт, 2 этаж)',
  'Bahandi Даймонд Плаза — Шымкент, проспект Нурсултана Назарбаева, 177Б (ТРК Diamond plaza, 4 этаж)',
  'Bahandi Байтурсынова — Алматы, ул. Байтурсынова, 61 (1 этаж)',
  'Bahandi ЦУМ Кар — Караганда, проспект Бухар Жырау, 53/8 (ТЦ ЦУМ, 3 этаж)',
  'Bahandi Гагарина — Алматы, проспект Гагарина, 41 (1 этаж)',
  'Bahandi Дала Молл — Шымкент, Алматинская трасса, 13а (ТЦ Dala Mall, 2 этаж)',
  'Bahandi Магнум Бесагаш — Алматы, Медеуский район, ул. Халиуллина, 194/3 (киоск)',
  'Bahandi Гульжан — Караганда, микрорайон Степной-1, 5/8 (киоск)',
  'Bahandi Сая Парк — Актау, 10-й микрорайон, 3 (ТЦ Saya Park, 2 этаж)',
  'Bahandi Капчагай — Алматы, г. Конаев, Алматинская улица, 64а (киоск)',
  'Bahandi Чубары — Астана, ул. Темирказык, 2Б (м-н Шубар, киоск)',
  'Bahandi Хан Шатыр — Астана, проспект Туран, 37 (ТРЦ Хан Шатыр, 3 этаж)',
  'Bahandi Юбилейный — Караганда, проспект Нуркена Абдирова, 38 (киоск)',
  'Bahandi Акжар — Алматы, Жандосова 254/9',
  'Bahandi Рио — Кокшетау, ул. Полины Осипенко, 1 (ТРЦ РИО, 4 этаж)',
  'Bahandi Аружан — Астана, ул. Илияса Жансугурова, 8/1 (ТРЦ Аружан, 3 этаж)',
  'Bahandi Магнум Туран — Астана, проспект Туран, 55д (киоск)',
  'Bahandi Далида Сити — Актобе, проспект Алии Молдагуловой, 72а (ТРЦ Dalida Plaza, 2 этаж)',
  'Bahandi Ритц Палас — Алматы, Самал-3 микрорайон, 2а (киоск)',
  'Bahandi Янги Шахар — Шымкент, Тамерлановское шоссе, 1а/8 (киоск)',
  'Bahandi Жаркент — Алматы, Панфиловский р-н, г. Жаркент, ул. Юлдашева, 7а (киоск)',
  'Bahandi Таукехана — Шымкент, проспект Тауке хана, 112 (киоск)',
  'Bahandi Роял Плаза — Шымкент, ул. Рыскулова, 8а/5 (ТРЦ Royal Plaza)',
  'Bahandi Петрова — Астана, ул. Алексея Петрова, 22г (1 этаж)',
  'Bahandi Мерей — Алматы, проспект Суюнбая, 2/Б (киоск)',
  'Bahandi Тастак — Алматы, Тастак-3 микрорайон, ул. Толе би, 229/3 (киоск)',
  'Bahandi Весновка — Алматы, Коктем-2 микрорайон, 22 (киоск)',
  'Bahandi Айнабулак — Алматы, Айнабулак 2 микрорайон, 82/4 (киоск)',
  'Bahandi Глобус Фудкорт — Алматы, Абая проспект, 109в (ТРЦ Globus, 2 этаж)',
  'Bahandi Динара — Шымкент, проспект Республики, 40/1 (1 этаж)',
  'Bahandi Мега SilkWay — Астана, проспект Кабанбай батыр, 62 (ТРЦ Мега SilkWay, 2 этаж)',
  'Bahandi Иманова — Астана, ул. Аменгельды Иманова, 3 (киоск)',
  'Bahandi Макси Молл — Усть-Каменогорск, проспект Каныша Сатпаева, 51 (ТРЦ Maxi Mall, 2 этаж)',
  'Bahandi Максима — Алматы, проспект Райымбека, 239г (ТРК Maxima, 3 этаж)',
  'Bahandi Магнум Аксуат — Алматы, ул. Аксуат, 128/2 (киоск)',
  'Bahandi Мега Парк Сейфуллина — Алматы, ул. Макатаева, 127/1 (ТРК MEGA Park, 3 этаж)',
  'Bahandi Шолохова — Алматы, ул. Шолохова, 8 (киоск)',
  'Bahandi АДК Ривер — Усть-Каменогорск, ул. Казахстан, 62 (ТРК ADK River, 3 этаж)',
  'Bahandi Байзаар — Атырау, ул. Бактыгерея Кулманова, 111а (ТРЦ Baizaar, 3 этаж)',
  'Bahandi Инфинити Молл — Атырау, проспект Каныша Сатпаева, 43а (ТРЦ Infinity Mall, 3 этаж)',
  'Bahandi Азия Парк — Астана, проспект Кабанбай батыра, 21 (ТРЦ Asia Park, 3 этаж)',
  'Bahandi Жумалиева — Алматы, ул. Толе би, 147 (1 этаж)',
  'Bahandi Магнум Кошкарбаева — Астана, ул. Едил, 26',
  'Bahandi Джангильдина — Алматы, ул. Демьяна Бедного, 3/2 (киоск)',
  'Bahandi Панфилова — Алматы, ул. Панфилова, 110 (киоск)',
  'Bahandi Водник — Алматы, ул. Алатау, 2д, пос. Боралдай (Рынок Алатау)',
  'Bahandi Белинского — Алматы, ул. Ильяса Жансугурова, 258 (киоск)',
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
