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
 * ── 1. ZONE 0: ENTRANCE LOBBY & RECEPTION CHECKPOINT (Z = 4 to -4) ──
 * ورودی ساختمان: دستگاه کپی اداری، آبسردکن، چوب‌لباسی، سطل تفکیک، ساعت و گیاهان ورودی
 */
function EntranceAndZone0Decorations() {
  return (
    <group>
      {/* ساعت دیواری آنالوگ ورودی بالای سر درگاه */}
      <AutoProp
        file="Analog clock.glb"
        position={[0, 6.2, 0.4]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* تقویم دیواری روی ستون ورودی */}
      <AutoProp
        file="Calendar.glb"
        position={[-2.3, 3.2, 0.25]}
        targetHeight={0.8}
        centerOrigin
      />

      {/* دستگاه پرینتر و کپی بزرگ اداری (سمت چپ ورودی مشابه عکس مرجع) */}
      <AutoProp
        file="Printer.glb"
        position={[-3.8, 0, -1.8]}
        rotation={[0, Math.PI / 4, 0]}
        targetHeight={1.1}
      />

      {/* سطل‌های بازیافت تفکیک پسماند ۳ رنگ ورودی */}
      <AutoProp
        file="Bins.glb"
        position={[-3.9, 0, 1.2]}
        rotation={[0, 0.2, 0]}
        targetHeight={0.75}
      />

      {/* رخت‌آویز ایستاده اداری ورودی همراه کیف چرمی */}
      <AutoProp
        file="Coat rack.glb"
        position={[3.8, 0, 1.8]}
        targetHeight={1.85}
      />
      <AutoProp
        file="Briefcase.glb"
        position={[3.4, 0, 1.6]}
        rotation={[0, 0.4, 0]}
        targetHeight={0.4}
      />

      {/* کارتن‌های پستی و بسته‌بندی در گوشه */}
      <AutoProp
        file="Cardboard Boxes.glb"
        position={[3.8, 0, -1.8]}
        rotation={[0, -0.4, 0]}
        targetHeight={0.65}
      />

      {/* گلدان‌های پایه‌دار سفید ورودی */}
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-4.5, 0, 3.2]}
        targetHeight={1.4}
      />
      <AutoProp
        file="Plant - White Pot.glb"
        position={[4.5, 0, 3.2]}
        targetHeight={1.4}
      />

      {/* دوربین مداربسته سقف ورودی */}
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
 * ── 2. SECTOR 1: SERVICES CONCOURSE (اتاق خدمات و استودیو - Z = -4 to -44) ──
 * شامل چیدمان ۱۰۰٪ مشابه عکس مرجع کاربر:
 * ۱. پاد مهندسی (سمت راست): میز دو مانیتوره، کمد بایگانی با گاندام و اسکیت‌برد، صندلی آبی، ماگ و دستمال
 * ۲. پاد لانژ و گفت‌وگو (سمت چپ): فرش هندسی آبی، میز مشکی دوتایی، مبل آبی، بین‌بگ قرمز، دارت، وندینگ ماشین
 * ۳. پاد مدیریتی (جلو): میز چوب تیره، کامپیوتر، تلفن اداری، چراغ مطالعه و دسته‌های کاغذ
 * ۴. کرکره‌های چوبی ونیزی روی تمامی پنجره‌های قدی
 */
function Room1ServicesDecorations() {
  return (
    <group>
      {/* ── پنجره‌های قدی: کرکره‌های چوبی ونیزی (Window Blinds) در سرتاسر اتاق ۱ ── */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -10]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -20]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -30]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -40]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -10]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -20]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -30]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -40]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── پاد مهندسی و برنامه‌نویسی راست (دقیقاً مشابه سمت راست تصویر کاربر) (Z = -12 تا -18) ── */}
      {/* میز کار استندینگ چوبی با فریم مشکی */}
      <AutoProp
        file="Standing Desk.glb"
        position={[5.5, 0, -15]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.1}
      />
      {/* پایه بازویی ارگونومیک با دو مانیتور عریض */}
      <AutoProp
        file="Dual Monitors on sit-stand arm.glb"
        position={[5.5, 1.1, -15]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={0.65}
      />
      {/* کیبورد، ماوس، ماوس‌پد و چراغ مطالعه روی میز */}
      <AutoProp file="Keyboard-fOy2zvPJAj-.glb" position={[5.1, 1.11, -15]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.03} />
      <AutoProp file="Mouse.glb" position={[5.1, 1.11, -14.6]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.04} />
      <AutoProp file="desk_lamp.glb" position={[5.8, 1.11, -15.6]} rotation={[0, -Math.PI / 2 + 0.4, 0]} targetHeight={0.45} />
      <AutoProp file="Tissue Box.glb" position={[5.6, 1.11, -14.4]} targetHeight={0.12} />
      <AutoProp file="Mug.glb" position={[5.2, 1.11, -15.5]} targetHeight={0.12} />
      <AutoProp file="Soda Can.glb" position={[5.4, 1.11, -15.5]} targetHeight={0.14} />

      {/* صندلی اداری چرخ‌دار آبی رنگ (همرنگ صندلی عکس) */}
      <AutoProp
        file="Chair-1MFMOaz3zqe.glb"
        position={[4.3, 0, -15]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.05}
      />

      {/* کمد بایگانی فلزی مشکی کشودار چسبیده به میز */}
      <AutoProp
        file="File Cabinet.glb"
        position={[6.6, 0, -16.5]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
      />
      {/* اسکیت‌برد جوان تکیه داده شده به جلوی کمد بایگانی */}
      <AutoProp
        file="Skateboard.glb"
        position={[6.2, 0, -16.5]}
        rotation={[0.15, -Math.PI / 2, 0.25]}
        targetHeight={0.82}
      />
      {/* فیگور ربات گاندام روی کمد بایگانی */}
      <AutoProp
        file="MS Gundam RX-78-2 with weapons.glb"
        position={[6.6, 1.2, -16.3]}
        rotation={[0, -Math.PI / 2 + 0.2, 0]}
        targetHeight={0.35}
      />
      {/* کارتن تحویل پستی روی کمد */}
      <AutoProp
        file="Cardboard Box.glb"
        position={[6.6, 1.2, -16.8]}
        rotation={[0, 0.3, 0]}
        targetHeight={0.25}
      />
      {/* گلدان برگ‌انجیری کنار کمد بایگانی */}
      <AutoProp
        file="Houseplant.glb"
        position={[7.4, 0, -16.5]}
        targetHeight={1.15}
      />

      {/* ── پاد لانژ و گفت‌وگوی خلاقانه چپ (دقیقاً مشابه مرکز تصویر کاربر) (Z = -12 تا -20) ── */}
      {/* فرش هندسی آبی و خاکستری بزرگ زیر مبل‌ها */}
      <AutoProp
        file="Rug.glb"
        position={[-5.8, 0.015, -15]}
        rotation={[0, 0, 0]}
        targetWidth={4.2}
        targetHeight={0.03}
      />
      {/* میز جلو مبلی مشکی دوتایی فلزی با طبقه زیرین */}
      <AutoProp
        file="Coffee Table.glb"
        position={[-5.8, 0, -15]}
        targetHeight={0.52}
      />
      {/* اکسسوری‌های روی میز جلو مبلی: گلدان صورتی، جعبه دستمال، ماگ، مجله */}
      <AutoProp file="Houseplant-VtJh4Irl4w.glb" position={[-6.2, 0.52, -15.3]} targetHeight={0.32} />
      <AutoProp file="Tissue Box.glb" position={[-5.8, 0.52, -14.8]} targetHeight={0.12} />
      <AutoProp file="Coffee cup.glb" position={[-5.4, 0.52, -15.2]} targetHeight={0.11} />
      <AutoProp file="Magazine.glb" position={[-5.5, 0.52, -14.7]} rotation={[0, 0.3, 0]} targetHeight={0.03} />

      {/* مبل تک‌نفره پارچه‌ای سرمه‌ای مدرن رو به میز */}
      <AutoProp
        file="Couch Small.glb"
        position={[-7.6, 0, -15]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.9}
      />

      {/* بین‌بگ قرمز رنگ راحت (Red Beanbag) در کنج لانژ */}
      <AutoProp
        file="Couch Small-ZOPP3KzNIk.glb"
        position={[-5.8, 0, -18.2]}
        rotation={[0, 0.5, 0]}
        targetHeight={0.75}
      />

      {/* سطل زباله مدرن استوانه‌ای کنار مبل */}
      <AutoProp
        file="Trashcan.glb"
        position={[-7.6, 0, -17.2]}
        targetHeight={0.45}
      />

      {/* پارتیشن تخته اعلانات و دارت پشت بین‌بگ */}
      <AutoProp
        file="Message board.glb"
        position={[-4.5, 1.8, -19.5]}
        rotation={[0, 0, 0]}
        targetHeight={1.8}
        centerOrigin
      />
      <AutoProp
        file="Dartboard.glb"
        position={[-4.0, 2.2, -19.4]}
        targetHeight={0.65}
        centerOrigin
      />

      {/* ── پاد میز مدیریت و کار اداری تیره (دقیقاً مشابه میز جلوی چپ عکس) (Z = -24 تا -30) ── */}
      <AutoProp
        file="Desk-V86Go2rlnq.glb"
        position={[-5.6, 0, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.05}
      />
      <AutoProp
        file="Computer.glb"
        position={[-5.6, 1.05, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.55}
      />
      <AutoProp file="Office Phone.glb" position={[-5.6, 1.05, -25.2]} rotation={[0, Math.PI / 2 - 0.2, 0]} targetHeight={0.2} />
      <AutoProp file="Mug With Office Tool.glb" position={[-5.8, 1.05, -26.7]} targetHeight={0.2} />
      <AutoProp file="desk_lamp.glb" position={[-5.9, 1.05, -25.3]} rotation={[0, Math.PI / 2 + 0.3, 0]} targetHeight={0.42} />
      <AutoProp file="Small Stack of Paper.glb" position={[-5.2, 1.05, -26.6]} rotation={[0, 0.2, 0]} targetHeight={0.08} />
      <AutoProp file="Potted Plant.glb" position={[-5.8, 1.05, -26.3]} targetHeight={0.16} />
      <AutoProp
        file="Office Chair.glb"
        position={[-4.5, 0, -26]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.1}
      />
      {/* فایلینگ کنار میز و گلدان روی آن */}
      <AutoProp
        file="Cabinet Bed Drawer Tabl.glb"
        position={[-6.8, 0, -26]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.75}
      />
      <AutoProp
        file="Plant - White Pot.glb"
        position={[-6.8, 0.75, -26]}
        targetHeight={0.7}
      />

      {/* ── ایستگاه بریک و آبسردکن با کاناپه بزرگ و فرش گرد (Z = -34 تا -40، راست) ── */}
      {/* فرش گرد قرمز/مرجانی (دقیقاً مشابه عکس) */}
      <AutoProp
        file="Rug Round.glb"
        position={[6.2, 0.015, -36]}
        targetWidth={3.4}
        targetHeight={0.03}
      />
      {/* کاناپه سرمه‌ای پهن با کوسن‌های لیمویی */}
      <AutoProp
        file="Couch _ Wide.glb"
        position={[6.2, 0, -37.2]}
        rotation={[0, 0, 0]}
        targetHeight={0.9}
      />
      <AutoProp
        file="Cushions.glb"
        position={[5.6, 0.5, -37.0]}
        targetHeight={0.3}
      />
      <AutoProp
        file="Cushions.glb"
        position={[6.8, 0.5, -37.0]}
        targetHeight={0.3}
      />
      {/* آب‌سردکن با گالن آب معدنی آبی چسبیده به کاناپه */}
      <AutoProp
        file="Water Cooler.glb"
        position={[4.6, 0, -37.2]}
        rotation={[0, 0.2, 0]}
        targetHeight={1.45}
      />
      {/* وندینگ ماشین قرمز و مشکی در کنج سالن */}
      <AutoProp
        file="Vending Machine.glb"
        position={[8.0, 0, -38.5]}
        rotation={[0, -Math.PI / 4, 0]}
        targetHeight={2.05}
      />

      {/* ── تابلوهای دکوراتیو روی دیوارهای سالن ۱ ── */}
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
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetHeight={0.35} centerOrigin />
      <AutoProp file="Analog clock.glb" position={[2.3, 3.2, 0.22]} targetHeight={0.65} centerOrigin />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
      <AutoProp file="CCTV Camera.glb" position={[-2.2, 4.9, 0.22]} rotation={[0, Math.PI / 3, 0]} targetHeight={0.35} centerOrigin />
    </group>
  );
}

/**
 * ── 4. SECTOR 2: MASTERWORKS EXHIBITION SHOWROOM (نمایشگاه تلویزیون‌های سه‌بعدی - Z = -44 to -84) ──
 * تزئینات مجلل گالری و سالن VIP تلویزیون‌ها:
 * فرش‌های دکوراتیو زیر تلویزیون‌ها، لانژ تماشای کاتالوگ با مبل‌های راحت، قفسه افتخارات، گلدان‌های پایه‌دار
 */
function Room2PortfolioDecorations() {
  return (
    <group>
      {/* ── پرده‌های کرکره‌ای چوبی روی تمامی پنجره‌های اتاق ۲ ── */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -52]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -62]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -72]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -52]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -62]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -72]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۱ (Z = -56، سمت چپ) ── */}
      <AutoProp file="Rug.glb" position={[-2.4, 0.015, -56]} rotation={[0, Math.PI / 8, 0]} targetWidth={3.6} targetHeight={0.03} />
      <AutoProp file="Plant - White Pot.glb" position={[-4.5, 0, -55]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[-0.8, 0, -57.5]} targetHeight={1.2} />

      {/* لانژ اختصاصی روبه‌روی تلویزیون ۱ */}
      <AutoProp file="Couch Medium.glb" position={[-6.8, 0, -56]} rotation={[0, Math.PI / 2 + 0.3, 0]} targetHeight={0.88} />
      <AutoProp file="Coffee Table.glb" position={[-5.2, 0, -56]} targetHeight={0.48} />
      <AutoProp file="Magazine.glb" position={[-5.2, 0.48, -56]} targetHeight={0.03} />
      <AutoProp file="Soda Can.glb" position={[-5.0, 0.48, -55.8]} targetHeight={0.14} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۲ (Z = -63، سمت راست) ── */}
      <AutoProp file="Rug Round.glb" position={[2.4, 0.015, -63]} targetWidth={3.5} targetHeight={0.03} />
      <AutoProp file="Plant - White Pot.glb" position={[4.5, 0, -62]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[0.8, 0, -64.5]} targetHeight={1.2} />

      {/* صندلی راحتی و قفسه کاتالوگ کنار تلویزیون ۲ */}
      <AutoProp file="Chair-1MFMOaz3zqe.glb" position={[6.5, 0, -63]} rotation={[0, -Math.PI / 2 - 0.2, 0]} targetHeight={0.95} />
      <AutoProp file="Medium Book Shelf.glb" position={[8.2, 0, -63]} rotation={[0, -Math.PI / 2, 0]} targetHeight={1.85} />
      <AutoProp file="Book Stack.glb" position={[8.2, 0.9, -63]} targetHeight={0.25} />
      <AutoProp file="Trophy.glb" position={[8.2, 1.4, -63]} targetHeight={0.32} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۳ (Z = -70، سمت چپ) ── */}
      <AutoProp file="Rug.glb" position={[-2.4, 0.015, -70]} rotation={[0, Math.PI / 8, 0]} targetWidth={3.6} targetHeight={0.03} />
      <AutoProp file="Houseplant-e9oRt-Ct6js.glb" position={[-4.5, 0, -69]} targetHeight={1.3} />
      <AutoProp file="Plant - White Pot.glb" position={[-0.8, 0, -71.5]} targetHeight={1.2} />

      {/* کنسول افتخارات و ربات گاندام کنار تلویزیون ۳ */}
      <AutoProp file="Cabinet.glb" position={[-6.8, 0, -70]} rotation={[0, Math.PI / 2, 0]} targetHeight={0.95} />
      <AutoProp file="MS Gundam RX-78-2 with weapons.glb" position={[-6.8, 0.95, -70]} targetHeight={0.42} />
      <AutoProp file="Trophy.glb" position={[-6.8, 0.95, -69.3]} targetHeight={0.32} />

      {/* ── فرش و تزیینات ایستگاه تلویزیون ۴ (Z = -77، سمت راست) ── */}
      <AutoProp file="Rug Round.glb" position={[2.4, 0.015, -77]} targetWidth={3.5} targetHeight={0.03} />
      <AutoProp file="Plant - White Pot.glb" position={[4.5, 0, -76]} targetHeight={1.4} />
      <AutoProp file="Houseplant.glb" position={[0.8, 0, -78.5]} targetHeight={1.2} />

      {/* لانژ راحتی با کاناپه روبه‌روی تلویزیون ۴ */}
      <AutoProp file="Couch Small.glb" position={[6.5, 0, -77]} rotation={[0, -Math.PI / 2, 0]} targetHeight={0.9} />
      <AutoProp file="Coffee Table.glb" position={[5.0, 0, -77]} targetHeight={0.48} />
      <AutoProp file="Tissue Box.glb" position={[5.0, 0.48, -77]} targetHeight={0.12} />

      {/* تابلوهای گالری */}
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
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetHeight={0.35} centerOrigin />
      <AutoProp file="Water Cooler.glb" position={[-2.8, 0, 1.4]} rotation={[0, 0.3, 0]} targetHeight={1.4} />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
    </group>
  );
}

/**
 * ── 6. SECTOR 3: COLLABORATION WORKFLOW & BREAKOUT (Z = -84 to -132) ──
 * میزهای تیمی، وایت‌بردها، میز پینگ‌پنگ تفریحی اداری، صندلی‌های ارگونومیک، کتابخانه
 */
function Room3CollaborationDecorations() {
  return (
    <group>
      {/* ── پرده‌های کرکره‌ای چوبی اتاق ۳ ── */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -92]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -104]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -116]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -126]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -92]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -104]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -116]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -126]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* ── میز پینگ‌پنگ اداری تفریحی (Table Tennis Table) در گوشه بریک (Z = -96، چپ) ── */}
      <AutoProp
        file="Table tennis table.glb"
        position={[-6.2, 0, -96]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={0.88}
      />
      <AutoProp file="Table Tennis Paddle.glb" position={[-6.0, 0.88, -95.6]} targetHeight={0.06} />
      <AutoProp file="Table Tennis Paddle.glb" position={[-6.4, 0.88, -96.4]} rotation={[0, 0.4, 0]} targetHeight={0.06} />

      {/* ── وایت‌برد ایستاده اتاق جلسات اسپرینت ── */}
      <AutoProp
        file="whiteboard.glb"
        position={[6.5, 0, -100]}
        rotation={[0, -Math.PI / 2 + 0.2, 0]}
        targetHeight={1.85}
      />

      {/* ── کتابخانه و پرونده‌های پروژه‌ها ── */}
      <AutoProp
        file="Medium Book Shelf.glb"
        position={[-8.2, 0, -112]}
        rotation={[0, Math.PI / 2, 0]}
        targetHeight={1.9}
      />
      <AutoProp file="Binder.glb" position={[-8.2, 0.95, -112]} targetHeight={0.28} />
      <AutoProp file="Book Stack.glb" position={[-8.2, 0.95, -111.4]} targetHeight={0.22} />

      {/* ── کمد فایلینگ با اسکیت‌برد و کارتن پستی ── */}
      <AutoProp
        file="File Cabinet.glb"
        position={[6.8, 0, -115]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
      />
      <AutoProp
        file="Skateboard.glb"
        position={[6.4, 0, -115]}
        rotation={[0.15, -Math.PI / 2, 0.25]}
        targetHeight={0.82}
      />
      <AutoProp
        file="Cardboard Box.glb"
        position={[6.8, 1.2, -115]}
        targetHeight={0.25}
      />

      {/* گلدان‌های شیک سفید پایه‌دار */}
      <AutoProp file="Plant - White Pot.glb" position={[-5.5, 0, -122]} targetHeight={1.4} />
      <AutoProp file="Plant - White Pot.glb" position={[5.5, 0, -122]} targetHeight={1.4} />
    </group>
  );
}

/**
 * ── 7. PORTAL 3-4 (Z = -132) ──
 */
function Portal3to4Decorations() {
  return (
    <group position={[0, 0, -132]}>
      <AutoProp file="Fire Exit Sign.glb" position={[0, 5.15, 0.22]} targetHeight={0.35} centerOrigin />
      <AutoProp file="Analog clock.glb" position={[-2.3, 3.2, 0.22]} targetHeight={0.65} centerOrigin />
      <AutoProp file="Fire Extinguisher.glb" position={[2.3, 1.1, 0.22]} targetHeight={0.65} centerOrigin />
    </group>
  );
}

/**
 * ── 8. SECTOR 4: EXECUTIVE CONSULTATION & VIP RECEPTION (Z = -132 to -160) ──
 * سوئیت مجلل مدیریت: مبلمان لوکس با فرش گرد قرمز، کانتر رسیپشن، آبسردکن، نخل‌های بلند، ویترین افتخارات
 */
function Room4ExecutiveDecorations() {
  return (
    <group>
      {/* پرده‌های کرکره‌ای چوبی اتاق مدیریت */}
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -140]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[-8.85, 3.8, -150]} rotation={[0, Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -140]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />
      <AutoProp file="Window Blinds.glb" position={[8.85, 3.8, -150]} rotation={[0, -Math.PI / 2, 0]} targetHeight={3.6} />

      {/* فرش گرد قرمز لوکس زیر کاناپه مشاوره */}
      <AutoProp
        file="Rug Round.glb"
        position={[-3.6, 0.015, -146]}
        targetWidth={3.8}
        targetHeight={0.03}
      />
      {/* کوسن‌های راحت روی کاناپه مدیریت */}
      <AutoProp
        file="Cushions.glb"
        position={[-3.4, 0.8, -147.2]}
        targetHeight={0.32}
      />
      <AutoProp
        file="Cushions.glb"
        position={[-4.2, 0.8, -147.2]}
        targetHeight={0.32}
      />

      {/* آب‌سردکن لوکس در کنج لانژ مدیریت */}
      <AutoProp
        file="Water Cooler.glb"
        position={[-6.5, 0, -148]}
        rotation={[0, 0.4, 0]}
        targetHeight={1.45}
      />

      {/* کمد بایگانی اداری و شلف افتخارات رسیپشن */}
      <AutoProp
        file="File Cabinet.glb"
        position={[6.2, 0, -147]}
        rotation={[0, -Math.PI / 2, 0]}
        targetHeight={1.2}
      />
      <AutoProp
        file="Trophy.glb"
        position={[6.2, 1.2, -146.7]}
        targetHeight={0.35}
      />
      <AutoProp
        file="Trophy.glb"
        position={[6.2, 1.2, -147.3]}
        targetHeight={0.35}
      />

      {/* دستگاه کپی و پرینتر مدیریت */}
      <AutoProp
        file="Printer.glb"
        position={[6.5, 0, -142]}
        rotation={[0, -Math.PI / 3, 0]}
        targetHeight={1.1}
      />

      {/* چوب‌لباسی ایستاده مدیریت */}
      <AutoProp
        file="Coat rack.glb"
        position={[-6.5, 0, -142]}
        targetHeight={1.85}
      />

      {/* گلدان‌های نخل بزرگ درگاه انتهای سالن */}
      <AutoProp file="Plant - White Pot.glb" position={[-5.5, 0, -156]} targetHeight={1.6} />
      <AutoProp file="Plant - White Pot.glb" position={[5.5, 0, -156]} targetHeight={1.6} />
    </group>
  );
}

/**
 * ── MASTER EXPORT: CAMPUS INTERIOR DECORATIONS ──
 * چیدمان ۱۰۰٪ غنی، شلوغ، پویا و واقع‌گرایانه با تمامی المان‌های اداری مدرن مشابه عکس مرجع
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
