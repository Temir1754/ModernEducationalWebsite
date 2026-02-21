import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown, Phone, Clock, MapPin } from "lucide-react";
import { Instagram, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Мектеп туралы",
      items: [
        { title: "Мектеп тарихы", href: "#" },
        { title: "Мектеп миссиясы", href: "#" },
        { title: "Мектеп құрылымы", href: "#" },
      ],
    },
    {
      title: "Мектеп төлқұжаты",
      items: [
        { title: "Мектеп Жарғысы", href: "#" },
        { title: "Ұжымдық келісім шарт", href: "#" },
        { title: "Білім беру мекемесіне дейінгі қауіпсіз жол қозғалысының схемасы", href: "#" },
      ],
    },
    {
      title: "Мемлекеттік аттестаттау",
      items: [
        { title: "Аттестаттау құжаттары", href: "#" },
        { title: "Бағалау критерийлері", href: "#" },
      ],
    },
    {
      title: "Әкімшілік",
      items: [
        { title: "Әкімшілік құрамы", href: "#" },
        { title: "Педагогикалық құрам", href: "#" },
        { title: "Ардагер ұстаздар", href: "#" },
      ],
    },
    {
      title: "Басқару",
      items: [
        { title: "Мектепішілік бақылау", href: "#" },
        { title: "Циклограмма", href: "#" },
        { title: "Педагогикалық кеңес", href: "#" },
        { title: "Педагогикалық Әдеп кеңесі", href: "#" },
        { title: "Қамқоршылық кеңес", href: "#" },
      ],
    },
    {
      title: "Қызметтер",
      items: [
        { title: "Оқу үдерісі", href: "#" },
        { title: "Тәрбие жұмысы", href: "#" },
        { title: "Мұғалімдер үшін", href: "#" },
        { title: "Ата-аналар үшін", href: "#" },
        { title: "Оқушылар үшін", href: "#" },
        { title: "Бос орындар", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    {
      href: "https://www.instagram.com/fgs.schoolkz/",
      icon: "fab fa-instagram",
      className: "text-pink-500 hover:text-pink-600 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Try to open Instagram app first, fallback to web
        window.location.href = 'instagram://user?username=fgs.schoolkz';
        setTimeout(() => {
          window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
        }, 1000);
      }
    },
    {
      href: "#",
      icon: "fab fa-telegram",
      className: "text-blue-500 hover:text-blue-600 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Ask user for Telegram channel/group link
        const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/fgs_school):');
        if (telegramLink) {
          // Extract username from link and try app first
          const username = telegramLink.replace('https://t.me/', '');
          window.location.href = `tg://resolve?domain=${username}`;
          setTimeout(() => {
            window.open(telegramLink, '_blank');
          }, 1000);
        }
      }
    },
    {
      href: "https://wa.me/77757906363",
      icon: "fab fa-whatsapp",
      className: "text-green-500 hover:text-green-600 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Try to open WhatsApp app first, fallback to web
        window.location.href = 'whatsapp://send?phone=77757906363';
        setTimeout(() => {
          window.open('https://wa.me/77757906363', '_blank');
        }, 1000);
      }
    },
    {
      href: "https://t.me/fgs_school",
      icon: "fab fa-telegram",
      className: "text-blue-500 hover:text-blue-600",
    },
    {
      href: "https://wa.me/77757906363",
      icon: "fab fa-whatsapp",
      className: "text-green-500 hover:text-green-600",
    },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Info Bar */}
        <div className="border-b border-gray-200 py-2">
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 hover:bg-gray-50 px-2 py-1 rounded"
                onClick={() => {
                  // Initiate phone call
                  window.location.href = 'tel:+77757906363';
                }}
              >
                <Phone className="w-4 h-4 text-primary mr-1" />
                +7‒775‒790‒63‒63
              </button>
              <span className="flex items-center">
                <Clock className="w-4 h-4 text-primary mr-1" />
                08:00 - 18:00
              </span>
              <button 
                className="hidden sm:flex items-center text-gray-600 hover:text-primary transition-colors duration-200 hover:bg-gray-50 px-2 py-1 rounded"
                onClick={() => {
                  // Open in 2GIS
                  window.open('https://go.2gis.com/DoFle', '_blank');
                }}
              >
                <MapPin className="w-4 h-4 text-primary mr-1" />
                Шымкент, Өтегенова 43А
              </button>
              
              {/* Prominent Social Media buttons */}
              <div className="hidden md:flex items-center space-x-2 ml-6 border-l border-gray-300 pl-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Try to open Instagram app first, fallback to web
                    window.location.href = 'instagram://user?username=fgs.schoolkz';
                    setTimeout(() => {
                      window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
                    }, 1000);
                  }}
                  className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 text-xs font-medium shadow-md"
                >
                  <Instagram className="w-4 h-4 mr-1" />
                  Instagram
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Ask user for Telegram channel/group link
                    const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/fgs_school):');
                    if (telegramLink) {
                      // Extract username from link and try app first
                      const username = telegramLink.replace('https://t.me/', '');
                      window.location.href = `tg://resolve?domain=${username}`;
                      setTimeout(() => {
                        window.open(telegramLink, '_blank');
                      }, 1000);
                    }
                  }}
                  className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-xs font-medium shadow-md"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Telegram
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Try to open WhatsApp app first, fallback to web
                    window.location.href = 'whatsapp://send?phone=77757906363';
                    setTimeout(() => {
                      window.open('https://wa.me/77757906363', '_blank');
                    }, 1000);
                  }}
                  className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-200 text-xs font-medium shadow-md"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </button>
              </div>
            </div>
            
            {/* Mobile Social Media Icons */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'instagram://user?username=fgs.schoolkz';
                  setTimeout(() => {
                    window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
                  }, 1000);
                }}
                className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transform hover:scale-110 transition-all duration-200 shadow-md"
              >
                <Instagram className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/fgs_school):');
                  if (telegramLink) {
                    const username = telegramLink.replace('https://t.me/', '');
                    window.location.href = `tg://resolve?domain=${username}`;
                    setTimeout(() => {
                      window.open(telegramLink, '_blank');
                    }, 1000);
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transform hover:scale-110 transition-all duration-200 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'whatsapp://send?phone=77757906363';
                  setTimeout(() => {
                    window.open('https://wa.me/77757906363', '_blank');
                  }, 1000);
                }}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transform hover:scale-110 transition-all duration-200 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            
            {/* Desktop Social Media Icons (old) - keeping for backward compatibility */}
            <div className="hidden items-center space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={link.className}
                  onClick={link.onClick}
                >
                  <i className={`${link.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}
