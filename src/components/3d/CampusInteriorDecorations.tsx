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
  centerOrigin?: boolean;
  castShadow?: boolean;
}

/**
 * ── RESILIENT AUTO-SCALED 3D PROP COMPONENT ──
 * این کامپوننت با محاسبه دقیق Bounding Box هر مدل GLB، اندازه آن را به مقیاس واقعی (متر)
 * تبدیل کرده و کف مدل را دقیقاً روی زمین (Y=0) یا مرکز دیوار قرار می‌دهد.
 */
function AutoProp({
  file,
  position,
  rotation = [0, 0, 0],
  targetHeight,
  targetWidth,
  centerOrigin = false,
  castShadow = false,
}: AutoPropProps) {
  // Safe URL encoding for file names with spaces and special characters
  const safeUrl = `/3Dmodels/${encodeURIComponent(file)}`;
  const gltf = useGLTF(safeUrl);

  const scene = useMemo(() => {
    try {
      const cloned = gltf.scene.clone(true);
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);

      let scale = 1.0;
      if (targetHeight && size.y > 0) {
        scale = targetHeight / size.y;
      } else if (targetWidth && size.x > 0) {
        scale = targetWidth / size.x;
      }

      // Center horizontally on local (0,0) and place bottom at Y=0 (or center if centerOrigin is true)
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
  }, [gltf, targetHeight, targetWidth, centerOrigin, castShadow, file]);

  if (!scene) return null;

  return (
    <group position={position} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * ── 1. ZONE 0 & ENTRANCE CORRIDOR (Z = 4 to -4) ──
 */
function EntranceAndZone0Decorations() {
  return (
    <group>
      {/* 1. ساعت دیواری آنالوگ ورودی بالای درگاه */}
      <AutoProp
        file="Analog clock.glb"
        position={[0, 6.2, 0.4]}
        rotation={[0, 0, 0]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* 2. گلدان‌های شیک سفید پایه‌دار ورودی ساختمان */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-3.8, 0, 2.2]}
        targetHeight={1.4}
      />
      <AutoProp
        file="Plant - White Pot.glb"
        position={[3.8, 0, 2.2]}
        targetHeight={1.4}
      />

      {/* 3. رخت‌آویز ایستاده اداری ورودی */}
      <AutoProp
        file="Coat rack.glb"
        position={[-3.8, 0, -1.8]}
        targetHeight={1.85}
      />

      {/* 4. کارتن‌های بسته‌بندی پستی مدرن در گوشه ورودی */}
      <AutoProp
        file="Cardboard Boxes.glb"
        position={[3.8, 0, -1.8]}
        rotation={[0, -0.4, 0]}
        targetHeight={0.65}
      />

      {/* 5. دوربین مداربسته سقف ورودی */}
      <AutoProp
        file="CCTV Camera.glb"
        position={[-2.4, 5.0, 0.2]}
        rotation={[0, Math.PI / 4, 0]}
        targetHeight={0.35}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 2. ROOM 1: SERVICES CONCOURSE (اتاق خدمات تخصصی - Z = -4 to -44) ──
 */
function Room1ServicesDecorations() {
  return (
    <group>
      {/* ── سمت چپ: کرنر تجهیزات استودیوی تیزر و تولید محتوا (Z = -14 تا -24) ── */}
      {/* پرده‌ها / لاملای شیشه‌ای پنجره قدی */}
      <AutoProp
        file="Window Blinds.glb"
        position={[-8.85, 2.2, -18]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={3.2}
      />
      <AutoProp
        file="Window Blinds.glb"
        position={[-8.85, 2.2, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={3.2}
      />

      {/* آباژور و چراغ استودیویی ایستاده پایه بلند */}
      <AutoProp
        file="Lamp.glb"
        position={[-8.2, 0, -20]}
        targetHeight={1.65}
      />

      {/* اسکیت‌برد جوان و خلاق تکیه داده شده به دیوار */}
      <AutoProp
        file="Skateboard.glb"
        position={[-8.7, 0, -15]}
        rotation={[0.15, Math.PI / 2, 0.25]}
        targetHeight={0.8}
      />

      {/* سطل زباله تفکیک پسماند مدرن */}
      <AutoProp
        file="Bins.glb"
        position={[-8.2, 0, -24]}
        targetHeight={0.5}
      />

      {/* ── سمت چپ: لانژ مینیاتوری استراحت و گفت‌وگو (Z = -30 تا -38) ── */}
      {/* کاناپه پارچه‌ای مدرن */}
      <AutoProp
        file="Couch Small.glb"
        position={[-7.8, 0, -34]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.85}
      />
      {/* فرش گرد زیر کاناپه */}
      <AutoProp
        file="Rug Round.glb"
        position={[-7.8, 0.01, -34]}
        targetHeight={0.02}
        targetWidth={2.4}
      />
      {/* میز جلو مبلی */}
      <AutoProp
        file="Coffee Table.glb"
        position={[-6.7, 0, -34]}
        targetHeight={0.45}
      />
      {/* گلدان فیکوس در کنج لانژ */}
      <AutoProp
        file="Houseplant-bfLOqIV5uP.glb"
        position={[-8.4, 0, -38]}
        targetHeight={1.1}
      />

      {/* ── سمت راست: قفسه‌های کتاب، کمد و اکسسوری‌های دیواری (Z = -14 تا -38) ── */}
      {/* کتابخانه مدرن اداری */}
      <AutoProp
        file="Medium Book Shelf.glb"
        position={[8.6, 0, -20]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.85}
      />
      {/* گلدان سفید دکوراتیو کنار قفسه */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[8.4, 0, -24]}
        targetHeight={1.35}
      />
      {/* کمد کشویی مدارک */}
      <AutoProp
        file="Cabinet Bed Drawer Tabl.glb"
        position={[8.5, 0, -32]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.9}
      />
      {/* سطل زباله فلزی کوچک */}
      <AutoProp
        file="Trashcan Small.glb"
        position={[8.4, 0, -35]}
        targetHeight={0.45}
      />

      {/* ── تابلوها و تأسیسات دیواری اتاق ۱ ── */}
      <AutoProp
        file="Wall Art 02.glb"
        position={[-8.85, 3.4, -14]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.2}
        centerOrigin
      />
      <AutoProp
        file="Wall Art 03.glb"
        position={[8.85, 3.4, -16]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
        centerOrigin
      />
      <AutoProp
        file="Air Vent.glb"
        position={[-8.85, 6.2, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.4}
        centerOrigin
      />
      <AutoProp
        file="Air Vent.glb"
        position={[8.85, 6.2, -26]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.4}
        centerOrigin
      />

      {/* پریز برق مدرن روی ستون */}
      <AutoProp
        file="Electrical outlet.glb"
        position={[-8.82, 1.1, -22]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.12}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 3. PORTAL 1-2 & REFRESHMENT NOOK (Z = -44) ──
 */
function Portal1to2Decorations() {
  return (
    <group position={[0, 0, -44]}>
      {/* تابلوی خروج اضطراری با نور نئونی بالای درگاه */}
      <AutoProp
        file="Fire Exit Sign.glb"
        position={[0, 5.15, 0.22]}
        targetHeight={0.35}
        centerOrigin
      />

      {/* آب‌سردکن اداری با مخزن شیشه‌ای شفاف در سمت چپ ورودی */}
      <AutoProp
        file="Water Cooler.glb"
        position={[-2.9, 0, 1.4]}
        rotation={[0, 0.3, 0]}
        targetHeight={1.4}
      />

      {/* کپسول آتشنشانی متصل به دیوار ستون درگاه */}
      <AutoProp
        file="Fire Extinguisher.glb"
        position={[2.4, 1.1, 0.2]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* دوربین مداربسته گوشه بالای درگاه */}
      <AutoProp
        file="CCTV Camera.glb"
        position={[-2.2, 4.9, 0.22]}
        rotation={[0, Math.PI / 3, 0]}
        targetHeight={0.35}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 4. ROOM 2: PORTFOLIO EXHIBITION SHOWROOM (اتاق نمونه‌کارها - Z = -44 to -84) ──
 */
function Room2PortfolioDecorations() {
  return (
    <group>
      {/* ── سمت چپ: لانژ VIP تماشای پروژه‌ها و ارائه به مشتری (Z = -54 تا -68) ── */}
      {/* کاناپه راحتی مدیوم */}
      <AutoProp
        file="Couch Medium.glb"
        position={[-7.8, 0, -60]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.85}
      />
      {/* فرش مستطیلی باوقار زیر کاناپه */}
      <AutoProp
        file="Rug.glb"
        position={[-7.8, 0.01, -60]}
        targetHeight={0.02}
        targetWidth={3.2}
      />
      {/* میز عسلی جلو مبلی */}
      <AutoProp
        file="Coffee Table.glb"
        position={[-6.7, 0, -60]}
        targetHeight={0.45}
      />
      {/* آباژور فلزی مدرن ایستاده */}
      <AutoProp
        file="Light Floor.glb"
        position={[-8.4, 0, -64]}
        targetHeight={1.6}
      />
      {/* گیاه گلدانی لوکس */}
      <AutoProp
        file="Houseplant-e9oRt-Ct6js.glb"
        position={[-8.4, 0, -56]}
        targetHeight={1.2}
      />

      {/* ── سمت چپ: کردنزای افتخارات و آرت استارتاپی (Z = -72 تا -78) ── */}
      {/* کمد کوتاه کنسول */}
      <AutoProp
        file="Cabinet.glb"
        position={[-8.6, 0, -74]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.95}
      />
      {/* فیگور نمادین گاندام روی کنسول */}
      <AutoProp
        file="MS Gundam RX-78-2 with weapons.glb"
        position={[-8.6, 0.95, -74]}
        rotation={[0, Math.PI / 2 - 0.2, 0]}
        targetHeight={0.42}
      />
      {/* تندیس طلایی جایزه برندینگ */}
      <AutoProp
        file="Trophy.glb"
        position={[-8.6, 0.95, -73.3]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.32}
      />

      {/* ── سمت راست: قفسه کتابخانه، صندلی‌های تک‌نفره و تفکیک فضا (Z = -54 تا -78) ── */}
      {/* قفسه بزرگ دیواری */}
      <AutoProp
        file="Shelf.glb"
        position={[8.6, 0, -62]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.9}
      />
      {/* دسته‌ای از کتاب‌های طراحی روی طبقه شلف */}
      <AutoProp
        file="Book Stack.glb"
        position={[8.6, 0.95, -62]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.25}
      />
      {/* مکعب روبیک روی شلف */}
      <AutoProp
        file="Rubik's cube.glb"
        position={[8.6, 0.95, -61.4]}
        targetHeight={0.16}
      />
      {/* صندلی تک‌نفره راحتی مدرن */}
      <AutoProp
        file="Chair-1MFMOaz3zqe.glb"
        position={[7.6, 0, -68]}
        rotation={[0, -Math.PI / 3, 0]}
        targetHeight={0.9}
      />
      {/* گلدان بزرگ کنار دیوار شیشه‌ای */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[8.4, 0, -72]}
        targetHeight={1.4}
      />
      {/* سطل زباله تفکیک */}
      <AutoProp
        file="Trash Bin.glb"
        position={[8.4, 0, -78]}
        targetHeight={0.45}
      />

      {/* ── تابلوها و پرده‌های اتاق ۲ ── */}
      <AutoProp
        file="Wall Art 05.glb"
        position={[-8.85, 3.4, -50]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.2}
        centerOrigin
      />
      <AutoProp
        file="Wall Art 06.glb"
        position={[8.85, 3.4, -54]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
        centerOrigin
      />
      <AutoProp
        file="Window Blinds.glb"
        position={[-8.85, 2.2, -66]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={3.2}
      />
      <AutoProp
        file="Window Blinds.glb"
        position={[8.85, 2.2, -66]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={3.2}
      />
      <AutoProp
        file="Air Vent.glb"
        position={[-8.85, 6.2, -68]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.4}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 5. PORTAL 2-3 & VENDING MACHINE BREAKOUT (Z = -84) ──
 */
function Portal2to3Decorations() {
  return (
    <group position={[0, 0, -84]}>
      {/* دستگاه اتوماتیک وندینگ نوشیدنی و اسنک */}
      <AutoProp
        file="Vending Machine.glb"
        position={[-3.3, 0, 1.5]}
        rotation={[0, 0.25, 0]}
        targetHeight={1.95}
      />

      {/* سطل زباله کنار دستگاه وندینگ */}
      <AutoProp
        file="Bins.glb"
        position={[-3.3, 0, 3.0]}
        targetHeight={0.5}
      />

      {/* رخت‌آویز ایستاده چوبی/فلزی */}
      <AutoProp
        file="Coat rack.glb"
        position={[3.3, 0, 1.5]}
        targetHeight={1.8}
      />

      {/* تابلوی خروج اضطراری */}
      <AutoProp
        file="Fire Exit Sign.glb"
        position={[0, 5.15, 0.22]}
        targetHeight={0.35}
        centerOrigin
      />

      {/* دوربین مداربسته */}
      <AutoProp
        file="CCTV Camera.glb"
        position={[2.2, 4.9, 0.22]}
        rotation={[0, -Math.PI / 3, 0]}
        targetHeight={0.35}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 6. ROOM 3: COLLABORATION & AGILE HUB (مراحل توسعه و اسکرام - Z = -84 to -132) ──
 */
function Room3CollaborationDecorations() {
  return (
    <group>
      {/* ── سمت چپ: بخش اسکرام، تخته وایت‌برد و برد پولاروید تیم (Z = -92 تا -124) ── */}
      {/* وایت‌برد ایستاده چرخ‌دار اسکرام */}
      <AutoProp
        file="whiteboard.glb"
        position={[-7.8, 0, -96]}
        rotation={[0, Math.PI / 2 - 0.25, 0]}
        targetHeight={1.85}
      />

      {/* برد یادداشت‌های انگیزشی و تسک‌های استارتاپی روی دیوار */}
      <AutoProp
        file="Message board.glb"
        position={[-8.85, 3.2, -103]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.1}
        centerOrigin
      />

      {/* عکس‌های پولاروید خاطرات تیمی روی دیوار */}
      <AutoProp
        file="Polaroids.glb"
        position={[-8.85, 3.2, -106]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.8}
        centerOrigin
      />

      {/* تخته دارت تفریحی تیم برنامه‌نویس‌ها روی دیوار */}
      <AutoProp
        file="Dartboard.glb"
        position={[-8.85, 2.6, -114]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* فرش گرد و صندلی استراحت پای دارت */}
      <AutoProp
        file="Rug Round.glb"
        position={[-7.8, 0.01, -114]}
        targetHeight={0.02}
        targetWidth={2.4}
      />
      <AutoProp
        file="Chair.glb"
        position={[-7.4, 0, -114]}
        rotation={[0, -Math.PI / 4, 0]}
        targetHeight={0.95}
      />

      {/* گلدان دکوراتیو در انتهای بخش اسکرام */}
      <AutoProp
        file="Houseplant-VtJh4Irl4w.glb"
        position={[-8.4, 0, -122]}
        targetHeight={1.1}
      />

      {/* ── سمت راست: ایستگاه پرینتر، فایلینگ و میز سیت‌استند (Z = -92 تا -126) ── */}
      {/* کمد کنسول پرینتر */}
      <AutoProp
        file="Cabinet.glb"
        position={[8.4, 0, -96]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.85}
      />
      {/* پرینتر چندکاره اداری روی کمد */}
      <AutoProp
        file="Printer.glb"
        position={[8.4, 0.85, -96]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.42}
      />
      {/* بسته‌های کاغذ پرینتر و کارتن در گوشه */}
      <AutoProp
        file="Cardboard Boxes-pMdXdrUHvX.glb"
        position={[8.4, 0, -98.5]}
        targetHeight={0.6}
      />

      {/* میز کاری برقی ایستاده (Adjustable / Sit-Stand Desk) */}
      <AutoProp
        file="Adjustable Desk.glb"
        position={[8.2, 0, -108]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.85}
      />
      {/* صندلی ارگونومیک اداری چرخ‌دار پای میز ایستاده */}
      <AutoProp
        file="Office Chair.glb"
        position={[7.3, 0, -108]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.95}
      />

      {/* گلدان سفید دکوراتیو */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[8.4, 0, -118]}
        targetHeight={1.4}
      />

      {/* سطل زباله اداری */}
      <AutoProp
        file="Trashcan.glb"
        position={[8.4, 0, -124]}
        targetHeight={0.45}
      />

      {/* ── تابلوها و تجهیزات دیواری اتاق ۳ ── */}
      <AutoProp
        file="Wall Art 06-1U5roiXQZAM.glb"
        position={[-8.85, 3.4, -90]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.2}
        centerOrigin
      />
      <AutoProp
        file="Blank Picture Frame.glb"
        position={[8.85, 3.4, -102]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.1}
        centerOrigin
      />
      <AutoProp
        file="Window Blinds.glb"
        position={[-8.85, 2.2, -106]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={3.2}
      />
      <AutoProp
        file="Window Blinds.glb"
        position={[8.85, 2.2, -106]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={3.2}
      />
      <AutoProp
        file="Fire Extinguisher.glb"
        position={[-8.85, 1.1, -128]}
        targetHeight={0.65}
        centerOrigin
      />
    </group>
  );
}

/**
 * ── 7. PORTAL 3-4 & ENTRANCE TO EXECUTIVE SUITE (Z = -132) ──
 */
function Portal3to4Decorations() {
  return (
    <group position={[0, 0, -132]}>
      {/* تابلوی خروج اضطراری */}
      <AutoProp
        file="Fire Exit Sign.glb"
        position={[0, 5.15, 0.22]}
        targetHeight={0.35}
        centerOrigin
      />

      {/* کپسول آتشنشانی روی چهارچوب ورودی */}
      <AutoProp
        file="Fire Extinguisher.glb"
        position={[-2.4, 1.1, 0.2]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* دوربین مداربسته ورودی سوئیت مدیریت */}
      <AutoProp
        file="CCTV Camera.glb"
        position={[-2.2, 4.9, 0.22]}
        rotation={[0, Math.PI / 4, 0]}
        targetHeight={0.35}
        centerOrigin
      />

      {/* رخت‌آویز لوکس کت و پالتوی میهمانان VIP */}
      <AutoProp
        file="Coat rack.glb"
        position={[3.2, 0, 1.5]}
        targetHeight={1.8}
      />

      {/* گلدان بزرگ ورودی مدیریت */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-3.2, 0, 1.5]}
        targetHeight={1.4}
      />
    </group>
  );
}

/**
 * ── 8. ROOM 4: EXECUTIVE SUITE & VIP CONSULTATION (اتاق مشاوره و مدیریت - Z = -132 to -160) ──
 */
function Room4ExecutiveDecorations() {
  return (
    <group>
      {/* ساعت دیواری مدیریتی بالای درگاه داخلی اتاق ۴ */}
      <AutoProp
        file="Analog clock.glb"
        position={[0, 5.6, -132.5]}
        rotation={[0, Math.PI, 0]}
        targetHeight={0.6}
        centerOrigin
      />

      {/* ── سمت چپ: مبلمان تکمیلی لانژ مشاوره VIP (Z = -142 تا -150) ── */}
      {/* فرش گرد بسیار بزرگ و باشکوه زیر کاناپه و میز عسلی مشاوره */}
      <AutoProp
        file="Rug Round.glb"
        position={[-2.8, 0.008, -146]}
        targetHeight={0.02}
        targetWidth={3.6}
      />

      {/* کاناپه کوچک دونفره میهمانان در زاویه ۹۰ درجه */}
      <AutoProp
        file="Couch Small-ZOPP3KzNIk.glb"
        position={[-4.8, 0, -146]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.8}
      />

      {/* آباژور لوکس ایستاده گوشه لانژ مشاوره */}
      <AutoProp
        file="Lamp.glb"
        position={[-5.0, 0, -149]}
        targetHeight={1.7}
      />

      {/* گلدان نخل مجلل کنار پنجره قدی مدیریت */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-5.2, 0, -143]}
        targetHeight={1.5}
      />

      {/* ── سمت راست: تجهیزات شیک کانتر رسیپشن و تماس مستقیم (Z = -142 تا -150) ── */}
      {/* کمد فایلینگ اداری مدرن با درهای کشویی */}
      <AutoProp
        file="File Cabinet.glb"
        position={[5.0, 0, -147]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.15}
      />

      {/* شلف دیواری ظریف بالای سر رسیپشن */}
      <AutoProp
        file="Wall Shelf.glb"
        position={[8.85, 3.2, -146]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.6}
        centerOrigin
      />

      {/* تندیس افتخارات آژانس اروم‌سیما روی شلف دیواری رسیپشن */}
      <AutoProp
        file="Trophy.glb"
        position={[8.8, 3.6, -146]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.35}
        centerOrigin
      />

      {/* سطل زباله ظریف مدیریت */}
      <AutoProp
        file="Trash Bin.glb"
        position={[4.6, 0, -144]}
        targetHeight={0.42}
      />

      {/* گلدان ورودی رسیپشن */}
      <AutoProp
        file="Houseplant.glb"
        position={[5.0, 0, -143]}
        targetHeight={1.1}
      />

      {/* ── انتهای سالن: درگاه شیشه‌ای بزرگ پانوراما (Z = -158) ── */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-5.5, 0, -158]}
        targetHeight={1.5}
      />
      <AutoProp
        file="Plant - White Pot.glb"
        position={[5.5, 0, -158]}
        targetHeight={1.5}
      />
    </group>
  );
}

/**
 * ── MASTER EXPORT: CAMPUS INTERIOR DECORATIONS ──
 * تمامی المان‌های دکوراتیو ۳بعدی جدید بدون افت فریم و با نهایت هماهنگی مقیاس
 */
export default function CampusInteriorDecorations() {
  return (
    <group>
      <EntranceAndZone0Decorations />
      <Room1ServicesDecorations />
      <Portal1to2Decorations />
      <Room2PortfolioDecorations />
      <Portal2to3Decorations />
      <Room3CollaborationDecorations />
      <Portal3to4Decorations />
      <Room4ExecutiveDecorations />
    </group>
  );
}
