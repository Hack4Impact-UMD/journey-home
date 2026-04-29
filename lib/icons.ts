import {
  CubeIcon,
  CouchIcon,
  ArmchairIcon,
  ChairIcon,
  OfficeChairIcon,
  StoolIcon,
  BedIcon,
  DresserIcon,
  TableIcon,
  DeskIcon,
  PicnicTableIcon,
  LampIcon,
  LampPendantIcon,
  FanIcon,
  OvenIcon,
  CookingPotIcon,
  CoffeeIcon,
  PackageIcon,
  ArchiveIcon,
  LockersIcon,
  BooksIcon,
  BasketIcon,
  BagIcon,
  BagSimpleIcon,
  BriefcaseIcon,
  BriefcaseMetalIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  FileTextIcon,
  FolderOpenIcon,
  ClipboardIcon,
  ArticleIcon,
  NewspaperIcon,
  EnvelopeIcon,
  MailboxIcon,
  TelevisionIcon,
  LaptopIcon,
  DesktopIcon,
  ComputerTowerIcon,
  DesktopTowerIcon,
  HardDriveIcon,
  HardDrivesIcon,
  GameControllerIcon,
  ProjectorScreenIcon,
  ProjectorScreenChartIcon,
  RadioIcon,
  PhoneIcon,
  CashRegisterIcon,
  RugIcon,
  PottedPlantIcon,
  DoorOpenIcon,
  GlobeIcon,
  BicycleIcon,
  FootballIcon,
  FootballHelmetIcon,
  FireIcon,
  FireSimpleIcon,
  FireExtinguisherIcon,
  FirstAidIcon,
  FirstAidKitIcon,
  FlashlightIcon,
  WrenchIcon,
  GearSixIcon,
  GearFineIcon,
  ToiletIcon,
  ToiletPaperIcon,
  TowelIcon,
  ShowerIcon,
  BathtubIcon,
  BroomIcon,
  TrashIcon,
} from "@phosphor-icons/react";

export type IconComponent = React.ComponentType<{
  className?: string;
}>;

export const DEFAULT_ICON_KEY = "box";

export const ICON_MAP: Record<string, IconComponent> = {
  // ── Seating ───────────────────────────────────────────────────────────
  "couch sofa":                      CouchIcon,
  "armchair":                        ArmchairIcon,
  "chair":                           ChairIcon,
  "office chair":                    OfficeChairIcon,
  "stool":                           StoolIcon,

  // ── Beds & Bedroom ────────────────────────────────────────────────────
  "bed":                             BedIcon,
  "dresser drawer":                  DresserIcon,

  // ── Tables & Desks ────────────────────────────────────────────────────
  "table":                           TableIcon,
  "desk":                            DeskIcon,
  "picnic table":                    PicnicTableIcon,

  // ── Lighting & Climate ────────────────────────────────────────────────
  "lamp":                            LampIcon,
  "lamp pendant":                    LampPendantIcon,
  "fan":                             FanIcon,

  // ── Kitchen ───────────────────────────────────────────────────────────
  "oven microwave":                  OvenIcon,
  "pots pans cookware":              CookingPotIcon,
  "coffee maker kettle":             CoffeeIcon,

  // ── Storage & Containers ──────────────────────────────────────────────
  "box package donation":            PackageIcon,
  "box archive storage":             ArchiveIcon,
  "lockers cabinets":                LockersIcon,
  "shelves bookshelf":               BooksIcon,
  "basket hamper laundry":           BasketIcon,

  // ── Bags & Carriers ───────────────────────────────────────────────────
  "bag tote 1":                      BagIcon,
  "bag tote 2":                      BagSimpleIcon,
  "bag briefcase luggage 1":         BriefcaseIcon,
  "bag briefcase luggage 2":         BriefcaseMetalIcon,
  "bag shopping groceries 1":        ShoppingBagIcon,
  "bag shopping groceries 2":        ShoppingCartIcon,

  // ── Documents & Paperwork ─────────────────────────────────────────────
  "document file paperwork":         FileTextIcon,
  "document folder filing":          FolderOpenIcon,
  "document clipboard checklist":    ClipboardIcon,
  "document article":                ArticleIcon,
  "document newspaper reading":      NewspaperIcon,
  "document envelope mail":          EnvelopeIcon,
  "mailbox":                         MailboxIcon,

  // ── Electronics & Tech ────────────────────────────────────────────────
  "tv television":                   TelevisionIcon,
  "computer laptop":                 LaptopIcon,
  "computer monitor screen":         DesktopIcon,
  "computer tower pc 1":             ComputerTowerIcon,
  "computer tower pc 2":             DesktopTowerIcon,
  "computer hard drive 1":           HardDriveIcon,
  "computer hard drive 2":           HardDrivesIcon,
  "gaming controller entertainment": GameControllerIcon,
  "projector screen 1":              ProjectorScreenIcon,
  "projector screen 2":              ProjectorScreenChartIcon,
  "radio stereo speaker":            RadioIcon,
  "phone telephone":                 PhoneIcon,
  "cash register donations":         CashRegisterIcon,

  // ── Flooring, Decor & Structure ───────────────────────────────────────
  "rug":                             RugIcon,
  "potted plant":                    PottedPlantIcon,
  "door entry":                      DoorOpenIcon,
  "globe world":                     GlobeIcon,

  // ── Outdoors & Sports ─────────────────────────────────────────────────
  "bicycle bike":                    BicycleIcon,
  "sports ball 1":                   FootballIcon,
  "sports gear helmet":              FootballHelmetIcon,

  // ── Safety & Emergency ────────────────────────────────────────────────
  "fire heater fireplace 1":         FireIcon,
  "fire heater fireplace 2":         FireSimpleIcon,
  "fire extinguisher safety":        FireExtinguisherIcon,
  "first aid medical 1":             FirstAidIcon,
  "first aid medical 2":             FirstAidKitIcon,
  "flashlight emergency light":      FlashlightIcon,

  // ── Tools & Maintenance ───────────────────────────────────────────────
  "tool wrench repair hardware":     WrenchIcon,
  "tool gear settings 1":            GearSixIcon,
  "tool gear settings 2":            GearFineIcon,

  // ── Bathroom ──────────────────────────────────────────────────────────
  "toilet":                          ToiletIcon,
  "toilet paper":                    ToiletPaperIcon,
  "towel":                           TowelIcon,
  "shower":                          ShowerIcon,
  "bathtub":                         BathtubIcon,

  // ── Cleaning & Waste ──────────────────────────────────────────────────
  "broom cleaning":                  BroomIcon,
  "trash bin garbage":               TrashIcon,

  // -default
  "box": CubeIcon
};
