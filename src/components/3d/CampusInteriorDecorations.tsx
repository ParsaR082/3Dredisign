'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

interface AutoPropProps {
  file: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetHeight?: number;
  targetWidth?: number;
  targetMaxDim?: number;
  centerOrigin?: boolean;
  castShadow?: boolean;
}

/**
 * ── RESILIENT AUTO-SCALED 3D PROP COMPONENT ──
 * این کامپوننت با محاسبه دقیق Bounding Box هر مدل GLB، اندازه آن را به مقیاس واقعی (متر)
 * تبدیل کرده و کف مدل را دقیقاً روی زمین (Y=0) یا مرکز دیوار قرار می‌دهد.
 * همچنین پشتیبانی از targetMaxDim تضمین می‌کند وسایلی مثل اسکیت‌برد و تابلوها ابعاد غیرمنطقی نگیرند.
 */
function AutoProp({
  file,
  position,
  rotation = [0, 0, 0],
  targetHeight,
  targetWidth,
  targetMaxDim,
  centerOrigin = false,
  castShadow = false,
}: AutoPropProps) {
  const safeUrl = `/3Dmodels/${encodeURIComponent(file)}`;
  const gltf = useGLTF(safeUrl);

  const scene = useMemo(() => {
    try {
      const cloned = gltf.scene.clone(true);
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);

      let scale = 1.0;
      const maxDim = Math.max(size.x, size.y, size.z);

      if (targetMaxDim && maxDim > 0) {
        scale = targetMaxDim / maxDim;
      } else if (targetHeight && size.y > 0) {
        scale = targetHeight / size.y;
      } else if (targetWidth && size.x > 0) {
        scale = targetWidth / size.x;
      }

      const xOff = -(box.min.x + size.x / 2);
      const yOff = centerOrigin ? -(box.min.y + size.y / 2) : -box.min.y;
      const zOff = -(box.min.z + size.z / 2);

      cloned.position.set(xOff, yOff, zOff);

      cloned.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = castShadow;
          child.receiveShadow = true;
          const mat = (child as THREE.Mesh).material as THREE.Material;
          if (mat) {
            mat.side = THREE.DoubleSide;
          }
        }
      });

      const wrapper = new THREE.Group();
      wrapper.add(cloned);
      wrapper.scale.set(scale, scale, scale);
      return wrapper;
    } catch (err) {
      console.warn(`[CampusDecorations] Error processing ${file}:`, err);
      return null;
    }
  }, [gltf, targetHeight, targetWidth, targetMaxDim, centerOrigin, castShadow, file]);

  if (!scene) return null;

  return (
    <group position={position} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * ── 1. ZONE 0: ENTRANCE LOBBY & RECEPTION CHECKPOINT (Z = 4 to -4) ──
 * ورودی ساختمان: ساعت دیواری روی درگاه، تقویم دیواری روی ستون، دستگاه کپی، سطل تفکیک، گیاهان ورودی
 */
function EntranceAndZone0Decorations() {
  return (
    <group>
      {/* ساعت دیواری آنالوگ بالای درگاه ورودی */}
      <AutoProp
        file="Analog clock.glb"
        position={[0, 6.2, 0.4]}
        targetMaxDim={0.55}
        centerOrigin
      />

      {/* تقویم دیواری نصب‌شده روی ستون آلومینیومی درگاه */}
      <AutoProp
        file="Calendar.glb"
        position={[-2.3, 3.2, 0.25]}
        targetMaxDim={0.75}
        centerOrigin
      />

      {/* دستگاه پرینتر و کپی بزرگ اداری سمت چپ ورودی */}
      <AutoProp
        file="Printer.glb"
        position={[-3.8, 0, -1.8]}
        rotation={[0, Math.PI / 4, 0]}
        targetHeight={1.05}
      />

      {/* سطل‌های بازیافت تفکیک پسماند ۳ رنگ ورودی */}
      <AutoProp
        file="Bins.glb"
        position={[-3.9, 0, 1.2]}
        rotation={[0, 0.2, 0]}
        targetHeight={0.75}
      />

      {/* چوب‌لباسی و رخت‌آویز ایستاده پرسنل */}
      <AutoProp
        file="Coat Rack.glb"
        position={[3.8, 0, -1.6]}
        targetHeight={1.85}
      />

      {/* گلدان بزرگ دکوراتیو سفید در ورودی سالن */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[3.8, 0, 1.2]}
        targetHeight={1.35}
      />
    </group>
  );
}

/**
 * ── 2. SECTOR 1: DIGITAL STRATEGY, DEVELOPER PODS & CREATIVE LOUNGE (Z = -4 to -44) ──
 * پادهای مهندسی نرم‌افزار، میز ایستاده، میزهای تیمی، لانژ خلاقیت با پارتیشن آکوستیک، میز مدیریت، ایستگاه استراحت
 */
function Room1StrategyDecorations() {
  return (
    <group>
      {/* پرده‌های کرکره‌ای چوبی روی پنجره‌های قدی چپ و راست سالن ۱ */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -10]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -20]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -30]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -10]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -20]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -30]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── پاد مهندسی شماره ۱ (راست، Z = -15): میز ایستاده برقی با دو مانیتور، کیس، صندلی و کمد فایلینگ ── */}
      <AutoProp
        file="Standing Desk.glb"
        position={[5.5, 0, -15]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.05}
      />
      {/* دو مانیتور برنامه‌نویسی روی میز ایستاده */}
      <AutoProp
        file="Monitor.glb"
        position={[5.5, 1.05, -15.4]}
        rotation={[0, -Math.PI / 2 + 0.15, 0]}
        targetHeight={0.46}
      />
      <AutoProp
        file="Monitor.glb"
        position={[5.5, 1.05, -14.6]}
        rotation={[0, -Math.PI / 2 - 0.15, 0]}
        targetHeight={0.46}
      />
      {/* کیبورد، ماوس، چراغ مطالعه و لیوان روی میز */}
      <AutoProp file="Keyboard-fOy2zvPJAj-.glb" position={[5.1, 1.06, -15]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.03} />
      <AutoProp file="Mouse.glb" position={[5.1, 1.06, -14.5]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.04} />
      <AutoProp file="desk_lamp.glb" position={[5.8, 1.06, -15.6]} rotation={[0, -Math.PI / 2 + 0.4, 0]} targetHeight={0.45} />
      <AutoProp file="Tissue Box.glb" position={[5.6, 1.06, -14.3]} targetMaxDim={0.24} />
      <AutoProp file="Mug.glb" position={[5.2, 1.06, -15.5]} targetMaxDim={0.12} />
      <AutoProp file="Soda Can.glb" position={[5.4, 1.06, -15.5]} targetMaxDim={0.14} />

      {/* صندلی اداری چرخ‌دار ارگونومیک با فاصله استاندارد از میز */}
      <AutoProp
        file="Chair-1MFMOaz3zqe.glb"
        position={[4.0, 0, -15]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.05}
      />

      {/* کمد بایگانی فلزی با فاصله مناسب ۱.۵ متری از میز برای جلوگیری از تداخل (Z = -17.5) */}
      <AutoProp
        file="File Cabinet.glb"
        position={[6.4, 0, -17.5]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
      />
      {/* اسکیت‌برد جوان با مقیاس انسانی ۷۸ سانتی‌متر و تکیه شیب‌دار به بدنه کمد */}
      <AutoProp
        file="Skateboard.glb"
        position={[6.0, 0, -17.5]}
        rotation={[0.15, -Math.PI / 2, 1.35]}
        targetMaxDim={0.78}
      />
      {/* فیگور ربات گاندام روی کمد بایگانی */}
      <AutoProp
        file="MS Gundam RX-78-2 with weapons.glb"
        position={[6.4, 1.2, -17.3]}
        rotation={[0, -Math.PI / 2 + 0.2, 0]}
        targetMaxDim={0.32}
      />
      {/* کارتن پستی روی کمد */}
      <AutoProp
        file="Cardboard Box.glb"
        position={[6.4, 1.2, -17.8]}
        rotation={[0, 0.3, 0]}
        targetMaxDim={0.3}
      />
      {/* گلدان برگ‌انجیری کنار کمد بایگانی نزدیک دیوار */}
      <AutoProp
        file="Houseplant.glb"
        position={[7.5, 0, -17.5]}
        targetHeight={1.15}
      />

      {/* ── پاد مهندسی شماره ۲ (راست، Z = -25): میز مدرن توسعه با ۲ صندلی ارگونومیک و ۲ مانیتور ── */}
      <AutoProp
        file="Adjustable Desk.glb"
        position={[5.6, 0, -25]}
        rotation={[0, 0, 0]}
        targetHeight={0.78}
      />
      {/* دو مانیتور ایستگاه دو نفره */}
      <AutoProp file="Computer.glb" position={[5.6, 0.78, -25.7]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.48} />
      <AutoProp file="Monitor.glb" position={[5.6, 0.78, -24.3]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.46} />
      <AutoProp file="keyboard.glb" position={[5.1, 0.79, -25.7]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.03} />
      <AutoProp file="Keyboard-fOy2zvPJAj-.glb" position={[5.1, 0.79, -24.3]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.03} />
      <AutoProp file="Small Stack of Paper.glb" position={[5.8, 0.79, -25.0]} targetMaxDim={0.28} />
      {/* کیس کامپیوتر روی زمین کنار میز */}
      <AutoProp file="pc_case.glb" position={[6.2, 0, -26.1]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.45} />
      {/* دو صندلی اداری رو به میز بدون تداخل */}
      <AutoProp file="Office Chair.glb" position={[4.3, 0, -25.7]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.05} />
      <AutoProp file="Office Chair.glb" position={[4.3, 0, -24.3]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.05} />
      <AutoProp file="Trashcan Small.glb" position={[6.6, 0, -23.5]} targetHeight={0.35} />

      {/* ── پاد لانژ خلاقیت چپ (Z = -12 تا -18) ── */}
      {/* فرش هندسی آبی و خاکستری بزرگ زیر مبل‌ها */}
      <AutoProp
        file="Rug.glb"
        position={[-5.8, 0.015, -15]}
        rotation={[0, 0, 0]}
        targetWidth={4.2}
        targetHeight={0.03}
      />
      {/* میز جلو مبلی مدرن دوتایی */}
      <AutoProp
        file="Coffee Table.glb"
        position={[-5.8, 0, -15]}
        targetHeight={0.52}
      />
      {/* اکسسوری‌های روی میز جلو مبلی: گلدان صورتی، جعبه دستمال، ماگ، مجله */}
      <AutoProp file="Houseplant-VtJh4Irl4w.glb" position={[-6.2, 0.52, -15.3]} targetHeight={0.32} />
      <AutoProp file="Tissue Box.glb" position={[-5.8, 0.52, -14.8]} targetMaxDim={0.24} />
      <AutoProp file="Coffee cup.glb" position={[-5.4, 0.52, -15.2]} targetMaxDim={0.11} />
      <AutoProp file="Magazine.glb" position={[-5.5, 0.52, -14.7]} rotation={[0, 0.3, 0]} targetHeight={0.03} />

      {/* مبل تک‌نفره پارچه‌ای سرمه‌ای مدرن رو به میز جلو مبلی */}
      <AutoProp
        file="Couch Small.glb"
        position={[-7.6, 0, -15]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.9}
      />

      {/* بین‌بگ راحت در کنج لانژ روبه‌روی میز */}
      <AutoProp
        file="Couch Small-ZOPP3KzNIk.glb"
        position={[-5.8, 0, -17.5]}
        rotation={[0, 0.5, 0]}
        targetHeight={0.75}
      />

      {/* سطل زباله مدرن استوانه‌ای کنار مبل */}
      <AutoProp
        file="Trashcan.glb"
        position={[-7.6, 0, -17.2]}
        targetHeight={0.45}
      />

      {/* ── پارتیشن دیواری آکوستیک ایستاده سالن ۱: کاملاً پایدار روی زمین با پایه‌های فولادی ── */}
      {/* دیواره جداکننده بین لانژ خلاقیت (Z = -15) و میز مدیریت (Z = -26) */}
      <group position={[-5.8, 0, -19.5]}>
        {/* پایه‌های فولادی مشکی روی موکت کف (Y=0) برای پایداری فیزیکی */}
        <mesh position={[-1.2, 0.02, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.35]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[1.2, 0.02, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.35]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* تیرک‌های نگهدارنده عمودی مشکی آلومینیومی */}
        <mesh position={[-1.2, 1.2, 0]}>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[1.2, 1.2, 0]}>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* پنل چوبی عایق با حاشیه تیره */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[2.8, 2.1, 0.06]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {/* روکش پارچه‌ای آکوستیک نمدی تیره (Felt Board) - سطح خارجی در Z = 0.045 رو به لانژ */}
        <mesh position={[0, 1.25, 0.035]}>
          <boxGeometry args={[2.65, 1.95, 0.02]} />
          <meshStandardMaterial color="#132E27" roughness={0.9} />
        </mesh>

        {/* تخته اعلانات: با چرخش -90 درجه روی محور Y دقیقاً موازی سطح دیوار و چسبیده به پنل نمدی */}
        <AutoProp
          file="Message board.glb"
          position={[-0.65, 1.35, 0.055]}
          rotation={[0, -Math.PI / 2, 0]}
          targetMaxDim={1.15}
          centerOrigin
        />
        {/* تخته دارت: با چرخش -90 درجه روی محور Y دقیقاً موازی دیوار و در ارتفاع استاندارد ۱.۴۵ متری */}
        <AutoProp
          file="Dartboard.glb"
          position={[0.65, 1.45, 0.055]}
          rotation={[0, -Math.PI / 2, 0]}
          targetMaxDim={0.48}
          centerOrigin
        />
      </group>

      {/* ── پاد میز مدیریت چپ (Z = -26): میز شیک مدیریتی با صندلی چرم، تلفن، لپ‌تاپ و کردانزا ── */}
      <AutoProp
        file="Desk-V86Go2rlnq.glb"
        position={[-5.8, 0, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.82}
      />
      <AutoProp
        file="Computer.glb"
        position={[-5.8, 0.82, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.52}
      />
      <AutoProp file="Office Phone.glb" position={[-5.8, 0.82, -25.2]} rotation={[0, Math.PI / 2 - 0.2, 0]} targetMaxDim={0.22} />
      <AutoProp file="Mug With Office Tool.glb" position={[-6.0, 0.82, -26.7]} targetMaxDim={0.18} />
      <AutoProp file="desk_lamp.glb" position={[-6.1, 0.82, -25.3]} rotation={[0, Math.PI / 2 + 0.3, 0]} targetHeight={0.42} />
      <AutoProp file="Small Stack of Paper.glb" position={[-5.4, 0.82, -26.6]} rotation={[0, 0.2, 0]} targetMaxDim={0.28} />
      <AutoProp file="Potted Plant.glb" position={[-6.0, 0.82, -26.3]} targetHeight={0.16} />
      <AutoProp
        file="Office Chair.glb"
        position={[-4.5, 0, -26]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.1}
      />
      {/* کردانزا و فایلینگ کنار میز مدیریت چسبیده به دیوار جانبی */}
      <AutoProp
        file="Cabinet Bed Drawer Tabl.glb"
        position={[-7.2, 0, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.75}
      />
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-7.2, 0.75, -26]}
        targetHeight={0.65}
      />

      {/* ── ایستگاه بریک و آبسردکن با کاناپه بزرگ و فرش گرد (Z = -32 تا -39، سمت راست دیوار) ── */}
      <AutoProp
        file="Rug Round.glb"
        position={[6.0, 0.015, -34]}
        targetWidth={3.2}
        targetHeight={0.03}
      />
      <AutoProp
        file="Couch _ Wide.glb"
        position={[6.8, 0, -34]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.9}
      />
      <AutoProp file="Cushions.glb" position={[6.8, 0.5, -33.4]} targetMaxDim={0.32} />
      <AutoProp file="Cushions.glb" position={[6.8, 0.5, -34.6]} targetMaxDim={0.32} />
      <AutoProp
        file="Coffee Table.glb"
        position={[5.4, 0, -34]}
        targetHeight={0.48}
      />
      {/* آب‌سردکن ایستاده با فاصله مطمئن از میز لوگو */}
      <AutoProp
        file="Water Cooler.glb"
        position={[7.4, 0, -31.8]}
        rotation={[0, -Math.PI / 4, 0]}
        targetHeight={1.45}
      />
      {/* وندینگ ماشین نوشیدنی و اسنک در کنج سالن */}
      <AutoProp
        file="Vending Machine.glb"
        position={[7.8, 0, -39.5]}
        rotation={[0, -Math.PI / 4, 0]}
        targetHeight={2.05}
      />

      {/* ── تابلوهای دکوراتیو روی دیوارهای بتنی/سفید سالن ۱ ── */}
      <AutoProp file="Wall Art 02.glb" position={[-8.85, 3.6, -14]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
      <AutoProp file="Wall Art 03.glb" position={[-8.85, 3.6, -34]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
      <AutoProp file="Wall Art 05.glb" position={[8.85, 3.6, -14]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
      <AutoProp file="Wall Art 06.glb" position={[8.85, 3.6, -28]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
    </group>
  );
}

/**
 * ── 3. PORTAL 1-2 & REFRESHMENT CORNER (Z = -44) ──
 */
function Portal1to2Decorations() {
  return (
    <group position={[0, 0, -44]}>
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetMaxDim={0.4} centerOrigin />
      <AutoProp file="Analog clock.glb" position={[2.3, 3.2, 0.22]} targetMaxDim={0.55} centerOrigin />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
      <AutoProp file="CCTV Camera.glb" position={[-2.2, 4.9, 0.22]} rotation={[0, Math.PI / 3, 0]} targetMaxDim={0.25} centerOrigin />
    </group>
  );
}

/**
 * ── 4. SECTOR 2: MASTERWORKS EXHIBITION SHOWROOM (نمایشگاه تلویزیون‌های سه‌بعدی - Z = -44 to -84) ──
 * تلویزیون‌های ۴ گانه در موقعیت‌های اصلی، همراه با میز پرزنتیشن مشتری، میز کاتالوگ، لانژ VIP و قفسه جوایز
 * مسیر تردد مرکزی (-2.25 تا +2.25) کاملاً باز و عاری از هرگونه شیء مزاحم است.
 */
function Room2PortfolioDecorations() {
  return (
    <group>
      {/* پرده‌های کرکره‌ای چوبی روی تمامی پنجره‌های اتاق ۲ */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -52]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -62]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -72]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -52]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -62]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -72]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── میز پرزنتیشن و جلسات مشتریان VIP (راست، Z = -48): میز گرد بزرگ با ۲ صندلی و تبلت ── */}
      <AutoProp
        file="Table Large Circular.glb"
        position={[6.2, 0, -49]}
        targetHeight={0.76}
      />
      <AutoProp file="tablet.glb" position={[6.0, 0.76, -48.8]} rotation={[0, 0.3, 0]} targetMaxDim={0.28} />
      <AutoProp file="Coffee cup.glb" position={[6.5, 0.76, -49.2]} targetMaxDim={0.11} />
      <AutoProp file="Magazine.glb" position={[5.9, 0.76, -49.3]} targetMaxDim={0.3} />
      {/* صندلی‌های دور میز پرزنتیشن */}
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[5.0, 0, -49]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.95} />
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[7.3, 0, -49]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.95} />

      {/* ── فرش و لانژ ایستگاه تلویزیون ۱ (Z = -56، سمت چپ) ── */}
      <AutoProp file="Rug.glb" position={[-2.4, 0.015, -56]} rotation={[0, Math.PI / 8, 0]} targetWidth={3.6} targetHeight={0.03} />
      {/* گلدان‌های کناری در موقعیت‌های امن خارج از راهروی تردد */}
      <AutoProp file="Plant - White Pot.glb" position={[-4.5, 0, -54]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[-4.8, 0, -58]} targetHeight={1.2} />

      {/* لانژ اختصاصی روبه‌روی تلویزیون ۱ */}
      <AutoProp file="Couch Medium.glb" position={[-6.8, 0, -56]} rotation={[0, Math.PI / 2 + 0.3, 0]} targetHeight={0.88} />
      <AutoProp file="Coffee Table.glb" position={[-5.2, 0, -56]} targetHeight={0.48} />
      <AutoProp file="Magazine.glb" position={[-5.2, 0.48, -56]} targetMaxDim={0.28} />
      <AutoProp file="Soda Can.glb" position={[-5.0, 0.48, -55.8]} targetMaxDim={0.14} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۲ (Z = -63، سمت راست) ── */}
      <AutoProp file="Rug Round.glb" position={[2.4, 0.015, -63]} targetWidth={3.5} targetHeight={0.03} />
      <AutoProp file="Plant - White Pot.glb" position={[4.5, 0, -61]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[4.8, 0, -65]} targetHeight={1.2} />

      {/* صندلی راحتی و قفسه کاتالوگ کنار تلویزیون ۲ */}
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[6.5, 0, -63]} rotation={[0, -Math.PI / 2 - 0.2, 0]} targetHeight={0.95} />
      <AutoProp file="Medium Book Shelf.glb" position={[8.2, 0, -63]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.85} />
      <AutoProp file="Book Stack.glb" position={[8.2, 0.9, -63]} targetMaxDim={0.28} />
      <AutoProp file="Trophy.glb" position={[8.2, 1.4, -63]} targetMaxDim={0.32} />

      {/* ── میز کریتیو و دیزاین ریویو (چپ، Z = -66): میز کار چوبی مدرن با لپ‌تاپ ── */}
      <AutoProp
        file="Desk.glb"
        position={[-6.5, 0, -66]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.78}
      />
      <AutoProp file="Laptop3D.glb" position={[-6.5, 0.78, -66]} rotation={[0, Math.PI / 2, 0]} targetMaxDim={0.38} />
      <AutoProp file="desk_lamp.glb" position={[-6.8, 0.78, -65.4]} rotation={[0, 0.3, 0]} targetHeight={0.42} />
      <AutoProp file="Mug.glb" position={[-6.2, 0.78, -66.5]} targetMaxDim={0.12} />
      <AutoProp file="Office Chair.glb" position={[-5.3, 0, -66]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.05} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۳ (Z = -70، سمت چپ) ── */}
      <AutoProp file="Rug.glb" position={[-2.4, 0.015, -70]} rotation={[0, Math.PI / 8, 0]} targetWidth={3.6} targetHeight={0.03} />
      <AutoProp file="Houseplant-e9oRt-Ct6js.glb" position={[-4.5, 0, -68]} targetHeight={1.3} />
      <AutoProp file="Plant - White Pot.glb" position={[-4.8, 0, -72]} targetHeight={1.2} />

      {/* کنسول افتخارات و ربات گاندام کنار تلویزیون ۳ */}
      <AutoProp file="Cabinet.glb" position={[-6.8, 0, -73]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.95} />
      <AutoProp file="MS Gundam RX-78-2 with weapons.glb" position={[-6.8, 0.95, -73]} targetMaxDim={0.35} />
      <AutoProp file="Trophy.glb" position={[-6.8, 0.95, -72.3]} targetMaxDim={0.32} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۴ (Z = -77، سمت راست) ── */}
      <AutoProp file="Rug Round.glb" position={[2.4, 0.015, -77]} targetWidth={3.5} targetHeight={0.03} />
      <AutoProp file="Plant - White Pot.glb" position={[4.5, 0, -75]} targetHeight={1.4} />
      <AutoProp file="Houseplant.glb" position={[4.8, 0, -79]} targetHeight={1.2} />

      {/* لانژ راحتی با کاناپه روبه‌روی تلویزیون ۴ */}
      <AutoProp file="Couch Small.glb" position={[6.5, 0, -77]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.9} />
      <AutoProp file="Coffee Table.glb" position={[5.0, 0, -77]} targetHeight={0.48} />
      <AutoProp file="Tissue Box.glb" position={[5.0, 0.48, -77]} targetMaxDim={0.24} />

      {/* تابلوهای گالری روی دیوارهای دو طرف */}
      <AutoProp file="Wall Art 02.glb" position={[-8.85, 3.6, -58]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
      <AutoProp file="Wall Art 05.glb" position={[8.85, 3.6, -70]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.3} centerOrigin />
    </group>
  );
}

/**
 * ── 5. PORTAL 2-3 & WATER NOOK (Z = -84) ──
 */
function Portal2to3Decorations() {
  return (
    <group position={[0, 0, -84]}>
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetMaxDim={0.4} centerOrigin />
      <AutoProp file="Water Cooler.glb" position={[-3.4, 0, 1.4]} rotation={[0, 0.3, 0]} targetHeight={1.4} />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
    </group>
  );
}

/**
 * ── 6. SECTOR 3: COLLABORATION WORKFLOW & BREAKOUT (Z = -84 to -132) ──
 * میزهای متنوع مهندسی، میز پینگ‌پنگ تفریحی در کنج اختصاصی، میز تدوین و پادکست، وایت‌برد موازی روی دیوار راست
 */
function Room3CollaborationDecorations() {
  return (
    <group>
      {/* پرده‌های کرکره‌ای چوبی اتاق ۳ */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -92]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -104]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -116]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -126]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -92]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -104]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -116]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -126]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── میز پینگ‌پنگ اداری در کنج بریک ورودی سالن ۳ (Z = -88، چپ): با مقیاس دقیق ۲.۷۴ متر و بدون تداخل با مرحله ۱ ── */}
      <AutoProp
        file="Table tennis table.glb"
        position={[-6.2, 0, -88]}
        rotation={[0, 0, 0]}
        targetWidth={2.74}
      />
      <AutoProp file="Table Tennis Paddle.glb" position={[-6.0, 0.74, -87.6]} targetMaxDim={0.24} />
      <AutoProp file="Table Tennis Paddle.glb" position={[-6.4, 0.74, -88.4]} rotation={[0, 0.4, 0]} targetMaxDim={0.24} />

      {/* ── وایت‌برد جلسات اسپرینت: نصب‌شده کاملاً موازی روی دیوار راست سالن رو به داخل اتاق (Z = -96) ── */}
      <AutoProp
        file="whiteboard.glb"
        position={[8.82, 2.2, -96]}
        rotation={[0, Math.PI, 0]}
        targetMaxDim={2.0}
        centerOrigin
      />
      {/* میز اسپرینت و ایده‌پردازی کنار وایت‌برد با صندلی‌ها */}
      <AutoProp
        file="Table.glb"
        position={[6.4, 0, -96]}
        rotation={[0, 0.2, 0]}
        targetHeight={0.76}
      />
      <AutoProp file="Sticky Notes.glb" position={[6.4, 0.76, -95.8]} targetMaxDim={0.18} />
      <AutoProp file="Pen.glb" position={[6.6, 0.76, -96.0]} targetMaxDim={0.15} />
      <AutoProp file="Office Chair.glb" position={[5.2, 0, -96]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.05} />
      <AutoProp file="Office Chair.glb" position={[7.6, 0, -96]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.05} />

      {/* ── ایستگاه تدوین ویدیو، پادکست و رسانه دیجیتال (راست، Z = -107): بدون تداخل با مرحله ۲ و ۴ ── */}
      <AutoProp
        file="Desk-EtJlOllzbf.glb"
        position={[6.0, 0, -107]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.78}
      />
      <AutoProp file="Computer.glb" position={[6.0, 0.78, -107]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.52} />
      <AutoProp file="Webcam.glb" position={[6.0, 1.3, -107]} targetMaxDim={0.12} />
      <AutoProp file="Laptop bag.glb" position={[6.5, 0, -108]} targetMaxDim={0.45} />
      <AutoProp file="Office Phone.glb" position={[6.0, 0.78, -106.3]} targetMaxDim={0.22} />
      <AutoProp file="Office Chair.glb" position={[4.7, 0, -107]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.05} />

      {/* ── ایستگاه مهندسی سیستم‌ها و تحقیق و توسعه (چپ، Z = -115): بین مرحله ۳ و مرحله ۵ بدون هیچ تداخلی ── */}
      <AutoProp
        file="Adjustable Desk.glb"
        position={[-6.0, 0, -115]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.78}
      />
      <AutoProp file="Monitor.glb" position={[-6.0, 0.78, -115.5]} rotation={[0, Math.PI / 2 + 0.1, 0]} targetHeight={0.46} />
      <AutoProp file="Monitor.glb" position={[-6.0, 0.78, -114.5]} rotation={[0, Math.PI / 2 - 0.1, 0]} targetHeight={0.46} />
      <AutoProp file="Keyboard-fOy2zvPJAj-.glb" position={[-5.5, 0.79, -115]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.03} />
      <AutoProp file="Mouse.glb" position={[-5.5, 0.79, -114.4]} targetMaxDim={0.12} />
      <AutoProp file="pc_case.glb" position={[-6.4, 0, -116]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.45} />
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[-4.7, 0, -115]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.05} />

      {/* ── قفسه کتابخانه و پرونده‌های فنی مهندسی (چپ، Z = -126) چسبیده به دیوار ── */}
      <AutoProp
        file="Medium Book Shelf.glb"
        position={[-8.2, 0, -126]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.9}
      />
      <AutoProp file="Binder.glb" position={[-8.2, 0.95, -126]} targetMaxDim={0.28} />
      <AutoProp file="Book Stack.glb" position={[-8.2, 0.95, -125.4]} targetMaxDim={0.24} />

      {/* ── کمد فایلینگ با اسکیت‌برد و جعبه (راست، Z = -124) با مقیاس صحیح ۷۸ سانتی‌متر ── */}
      <AutoProp
        file="File Cabinet.glb"
        position={[7.0, 0, -124]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
      />
      <AutoProp
        file="Skateboard.glb"
        position={[6.6, 0, -124]}
        rotation={[0.15, -Math.PI / 2, 1.35]}
        targetMaxDim={0.78}
      />
      <AutoProp
        file="Cardboard Box.glb"
        position={[7.0, 1.2, -124]}
        targetMaxDim={0.28}
      />

      {/* گلدان‌های شیک سفید پایه‌دار سالن */}
      <AutoProp file="Plant - White Pot.glb" position={[-6.0, 0, -130]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[6.0, 0, -130]} targetHeight={1.4} />
    </group>
  );
}

/**
 * ── 7. PORTAL 3-4 (Z = -132) ──
 */
function Portal3to4Decorations() {
  return (
    <group position={[0, 0, -132]}>
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetMaxDim={0.4} centerOrigin />
      <AutoProp file="Analog clock.glb" position={[-2.3, 3.2, 0.22]} targetMaxDim={0.55} centerOrigin />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
    </group>
  );
}

/**
 * ── 8. SECTOR 4: EXECUTIVE CONSULTATION & VIP RECEPTION (Z = -132 to -160) ──
 * سوئیت مجلل مدیریت و مشاوره: میز کنفرانس گرد بزرگ با صندلی‌ها، مبلمان VIP، ویترین افتخارات و گلدان‌های نخل
 */
function Room4ExecutiveDecorations() {
  return (
    <group>
      {/* پرده‌های کرکره‌ای چوبی اتاق مدیریت */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -140]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -150]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -140]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -150]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── میز جلسات هیئت مدیره و مشاوره استراتژیک (راست، Z = -144): میز گرد بزرگ با ۳ صندلی ── */}
      <AutoProp
        file="Table Large Circular.glb"
        position={[5.6, 0, -144]}
        targetHeight={0.76}
      />
      <AutoProp file="notebook.glb" position={[5.4, 0.76, -143.8]} targetMaxDim={0.28} />
      <AutoProp file="Pens.glb" position={[5.7, 0.76, -144.1]} targetMaxDim={0.16} />
      <AutoProp file="Coffee cup.glb" position={[5.9, 0.76, -143.6]} targetMaxDim={0.11} />
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[4.3, 0, -144]} rotation={[0, Math.PI / 2, 0]} targetHeight={1.0} />
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[6.9, 0, -144]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.0} />
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[5.6, 0, -145.3]} rotation={[0, 0, 0]} targetHeight={1.0} />

      {/* ── لانژ VIP گفت‌وگوی مدیران (چپ، Z = -146) ── */}
      <AutoProp
        file="Rug Round.glb"
        position={[-5.6, 0.015, -146]}
        targetWidth={3.8}
        targetHeight={0.03}
      />
      <AutoProp
        file="Couch _ Wide.glb"
        position={[-5.6, 0, -147.2]}
        rotation={[0, 0, 0]}
        targetHeight={0.9}
      />
      <AutoProp file="Cushions.glb" position={[-5.0, 0.5, -147.0]} targetMaxDim={0.32} />
      <AutoProp file="Cushions.glb" position={[-6.2, 0.5, -147.0]} targetMaxDim={0.32} />
      <AutoProp file="Coffee Table.glb" position={[-5.6, 0, -145.2]} targetHeight={0.48} />
      <AutoProp file="Tissue Box.glb" position={[-5.6, 0.48, -145.2]} targetMaxDim={0.24} />
      <AutoProp file="Magazine.glb" position={[-5.2, 0.48, -145.0]} targetMaxDim={0.28} />

      {/* کنسول افتخارات و جوایز دیوار پشتی (Z = -157.5) */}
      <AutoProp
        file="Cabinet.glb"
        position={[0, 0, -157.5]}
        rotation={[0, 0, 0]}
        targetHeight={1.0}
      />
      <AutoProp file="Trophy.glb" position={[-0.8, 1.0, -157.5]} targetMaxDim={0.35} />
      <AutoProp file="Trophy.glb" position={[0.8, 1.0, -157.5]} targetMaxDim={0.35} />
      <AutoProp file="Plant - White Pot.glb" position={[0, 1.0, -157.5]} targetHeight={0.65} />

      {/* دو نخل بلند و باابهت در دو گوشه انتهای سالن */}
      <AutoProp file="Houseplant.glb" position={[-7.8, 0, -157]} targetHeight={2.3} />
      <AutoProp file="Houseplant.glb" position={[7.8, 0, -157]} targetHeight={2.3} />
    </group>
  );
}

/**
 * ── MAIN EXPORT: CAMPUS INTERIOR DECORATIONS ──
 */
export default function CampusInteriorDecorations() {
  return (
    <group name="CampusInteriorDecorations">
      <EntranceAndZone0Decorations />
      <Room1StrategyDecorations />
      <Portal1to2Decorations />
      <Room2PortfolioDecorations />
      <Portal2to3Decorations />
      <Room3CollaborationDecorations />
      <Portal3to4Decorations />
      <Room4ExecutiveDecorations />
    </group>
  );
}
