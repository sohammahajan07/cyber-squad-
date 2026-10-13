import React, { useState, useEffect } from 'react';
import {
  Role,
  Language,
  ProduceListing,
  VendorRequirement,
  BidOffer,
  MandiRate,
  GatePass,
  UserProfile,
  ContactEnquiry,
  ThemeMode
} from './types/market';
import {
  getStoredListings,
  saveStoredListings,
  getStoredRequirements,
  saveStoredRequirements,
  getStoredMandiRates,
  getStoredBids,
  saveStoredBids,
  getStoredGatePasses,
  saveStoredGatePasses,
  getStoredRole,
  saveStoredRole,
  getStoredLang,
  saveStoredLang,
  getStoredUser,
  saveStoredUser,
  getStoredEnquiries,
  saveStoredEnquiries,
  getStoredTheme,
  saveStoredTheme
} from './utils/storage';
import { TRANSLATIONS } from './utils/translations';
import { Header } from './components/Header';
import { PriceTicker } from './components/PriceTicker';
import { FarmerView } from './components/FarmerView';
import { VendorView } from './components/VendorView';
import { ApmcView } from './components/ApmcView';
import { PostProduceModal } from './components/PostProduceModal';
import { PostRequirementModal } from './components/PostRequirementModal';
import { ProduceDetailModal } from './components/ProduceDetailModal';
import { GatePassModal } from './components/GatePassModal';
import { LoginModal } from './components/LoginModal';
import { EnquiryModal } from './components/EnquiryModal';
import { PredictionDetailModal } from './components/PredictionDetailModal';
import { FarmerPresentationModal } from './components/FarmerPresentationModal';
import { Sprout, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser);
  const [role, setRole] = useState<Role>(() => getStoredUser().role);
  const [lang, setLang] = useState<Language>(getStoredLang);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [listings, setListings] = useState<ProduceListing[]>(getStoredListings);

  // Apply dark mode class to html element and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    saveStoredTheme(theme);
  }, [theme]);
  const [requirements, setRequirements] = useState<VendorRequirement[]>(getStoredRequirements);
  const [mandiRates] = useState<MandiRate[]>(getStoredMandiRates); // Mandi rates are non-editable
  const [bids, setBids] = useState<BidOffer[]>(getStoredBids);
  const [gatePasses, setGatePasses] = useState<GatePass[]>(getStoredGatePasses);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(getStoredEnquiries);

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginTargetRole, setLoginTargetRole] = useState<Role>(() => getStoredUser().role);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [inspectingListing, setInspectingListing] = useState<ProduceListing | null>(null);
  const [viewingGatePass, setViewingGatePass] = useState<GatePass | null>(null);
  const [tickerSelectedRate, setTickerSelectedRate] = useState<MandiRate | null>(null);

  const handleOpenLoginModal = (targetRole?: Role) => {
    setLoginTargetRole(targetRole || role);
    setIsLoginModalOpen(true);
  };
  const [enquiryContext, setEnquiryContext] = useState<{
    targetId: string;
    targetName: string;
    targetRole: 'farmer' | 'vendor';
    referenceType: 'produce' | 'requirement';
    referenceId: string;
    referenceTitle: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    saveStoredRole(newRole);
    // If the logged in user is of a different role, automatically offer login/profile update
    if (currentUser.role !== newRole) {
      setCurrentUser((prev) => {
        const updated = {
          ...prev,
          role: newRole,
          name: newRole === 'farmer' ? 'Ramesh Patil' : newRole === 'vendor' ? 'Deepak Agrawal' : 'Officer S. K. Deshmukh',
        };
        saveStoredUser(updated);
        return updated;
      });
    }
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    saveStoredLang(newLang);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setRole(user.role);
    saveStoredRole(user.role);
    showToast(`Logged in successfully as ${user.name} (${user.role.toUpperCase()})`);
  };

  // Add Produce
  const handleAddListing = (newListingData: Omit<ProduceListing, 'id' | 'createdAt' | 'bidsCount'>) => {
    const newListing: ProduceListing = {
      ...newListingData,
      id: `lot-${Date.now()}`,
      createdAt: 'Just now',
      bidsCount: 0,
    };
    const updated = [newListing, ...listings];
    setListings(updated);
    saveStoredListings(updated);
    showToast(`Produce lot for ${newListing.vegetableName} listed! Contact details protected.`);
  };

  // Add Requirement
  const handleAddRequirement = (newReqData: Omit<VendorRequirement, 'id' | 'createdAt' | 'matchedListingsCount'>) => {
    const newReq: VendorRequirement = {
      ...newReqData,
      id: `req-${Date.now()}`,
      createdAt: 'Just now',
      matchedListingsCount: 1,
    };
    const updated = [newReq, ...requirements];
    setRequirements(updated);
    saveStoredRequirements(updated);
    showToast(`Requirement for ${newReq.vegetableName} broadcast!`);
  };

  // Place Bid
  const handlePlaceBid = (bidData: Omit<BidOffer, 'id' | 'createdAt' | 'status'>) => {
    const newBid: BidOffer = {
      ...bidData,
      id: `bid-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now',
    };
    const updatedBids = [newBid, ...bids];
    setBids(updatedBids);
    saveStoredBids(updatedBids);

    const updatedListings = listings.map((l) =>
      l.id === bidData.listingId ? { ...l, bidsCount: l.bidsCount + 1 } : l
    );
    setListings(updatedListings);
    saveStoredListings(updatedListings);
    showToast(`Purchase offer of ₹${newBid.offeredPricePerKg}/kg submitted!`);
  };

  // Accept Bid & Generate Official Gate Pass
  const handleAcceptBid = (bid: BidOffer, listing: ProduceListing) => {
    const updatedBids = bids.map((b) =>
      b.id === bid.id ? { ...b, status: 'accepted' as const } : b
    );
    setBids(updatedBids);
    saveStoredBids(updatedBids);

    const updatedListings = listings.map((l) =>
      l.id === listing.id ? { ...l, status: 'sold' as const } : l
    );
    setListings(updatedListings);
    saveStoredListings(updatedListings);

    // Also approve contact details sharing automatically upon contract acceptance
    const updatedEnquiries = enquiries.map((e) =>
      e.referenceId === listing.id ? { ...e, status: 'approved' as const } : e
    );
    setEnquiries(updatedEnquiries);
    saveStoredEnquiries(updatedEnquiries);

    const totalAmount =
      (bid.unit === 'quintal' ? bid.offeredQuantity * 100 : bid.offeredQuantity) *
      bid.offeredPricePerKg;
    const mandiFeePercent = 1.05;
    const mandiFeeAmount = Math.round((totalAmount * mandiFeePercent) / 100);

    const generatedPass: GatePass = {
      passNumber: `APMC/${listing.mandiYard.slice(0, 3).toUpperCase()}/2026/G-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName: listing.farmerName,
      vendorName: bid.vendorName,
      mandiName: listing.mandiYard,
      commodity: `${listing.vegetableName} (${listing.qualityGrade})`,
      quantity: bid.offeredQuantity,
      unit: bid.unit,
      ratePerKg: bid.offeredPricePerKg,
      totalAmount,
      mandiFeePercent,
      mandiFeeAmount,
      vehicleNumber: 'MH-15-EG-4921',
      gateNumber: 'Gate 4 Weighbridge',
      issueTimestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      qrData: `APMC-SAUDA-${listing.id}-${bid.id}`,
      status: 'ISSUED',
    };

    const updatedPasses = [generatedPass, ...gatePasses];
    setGatePasses(updatedPasses);
    saveStoredGatePasses(updatedPasses);

    setViewingGatePass(generatedPass);
    showToast(`Bid accepted! Contact details shared & APMC Gate Pass generated.`);
  };

  // Counter Bid
  const handleCounterBid = (bidId: string, counterPrice: number) => {
    const updatedBids = bids.map((b) =>
      b.id === bidId
        ? { ...b, status: 'countered' as const, counterPricePerKg: counterPrice }
        : b
    );
    setBids(updatedBids);
    saveStoredBids(updatedBids);
    showToast(`Counter offer of ₹${counterPrice}/kg sent.`);
  };

  // Reject Bid
  const handleRejectBid = (bidId: string) => {
    const updatedBids = bids.map((b) =>
      b.id === bidId ? { ...b, status: 'rejected' as const } : b
    );
    setBids(updatedBids);
    saveStoredBids(updatedBids);
    showToast(`Offer declined.`);
  };

  // Send Enquiry / Apply for Contact Details Sharing
  const handleSendEnquiry = (enquiryData: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnquiry: ContactEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now',
    };
    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    saveStoredEnquiries(updated);
    showToast(t.enquirySent);
  };

  // Approve Enquiry -> Shares Mutual Contact Details between Farmer & Vendor!
  const handleApproveEnquiry = (enquiryId: string) => {
    const updated = enquiries.map((e) => {
      if (e.id !== enquiryId) return e;

      let farmerContact = e.farmerContact;
      let vendorContact = e.vendorContact;

      if (e.referenceType === 'produce') {
        const listing = listings.find((l) => l.id === e.referenceId);
        farmerContact = {
          name: listing?.farmerName || e.toUserName,
          phone: listing?.farmerPhone || '+91 98221 45678',
          farmAddress: listing?.exactFarmAddress || 'Patil Farm, Survey #44, Niphad, Nashik',
          location: listing?.farmLocation || 'Nashik, Maharashtra',
        };
        vendorContact = {
          name: e.fromUserName,
          companyName: e.fromUserName,
          phone: e.fromPhone || '+91 98190 77221',
          deliveryAddress: 'Sector 19 Cold Storage Hub, Vashi APMC, Navi Mumbai',
          location: e.fromLocation || 'Vashi APMC',
        };
      } else {
        const req = requirements.find((r) => r.id === e.referenceId);
        vendorContact = {
          name: req?.vendorName || e.toUserName,
          companyName: req?.companyName || 'FreshKart Wholesale',
          phone: req?.vendorPhone || '+91 98190 77221',
          deliveryAddress: req?.exactDeliveryAddress || 'Commercial Warehouse #B-4, Vashi APMC Complex',
          location: req?.deliveryLocation || 'Vashi, Maharashtra',
        };
        farmerContact = {
          name: e.fromUserName,
          phone: e.fromPhone || '+91 98221 45678',
          farmAddress: e.fromLocation || 'Gat #118, Rural Farm, Maharashtra',
          location: e.fromLocation || 'Maharashtra',
        };
      }

      return {
        ...e,
        status: 'approved' as const,
        farmerContact,
        vendorContact,
      };
    });

    setEnquiries(updated);
    saveStoredEnquiries(updated);
    showToast(t.sharedContactDetails);
  };

  // Reject Enquiry
  const handleRejectEnquiry = (enquiryId: string) => {
    const updated = enquiries.map((e) =>
      e.id === enquiryId ? { ...e, status: 'rejected' as const } : e
    );
    setEnquiries(updated);
    saveStoredEnquiries(updated);
    showToast(t.enquiryRejected);
  };

  const handleCreateGatePass = (newPass: GatePass) => {
    const updated = [newPass, ...gatePasses];
    setGatePasses(updated);
    saveStoredGatePasses(updated);
  };

  const pendingEnquiriesCount = enquiries.filter(
    (e) => e.status === 'pending' && (role === 'farmer' ? e.toRole === 'farmer' : e.toRole === 'vendor')
  ).length;

  const unreadBidsCount = bids.filter((b) => b.status === 'pending').length;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-100/70 text-stone-900'} flex flex-col font-sans selection:bg-emerald-200 transition-colors duration-200`}>
      
      {/* 1. Live APMC Price Ticker (Multilingual with 7D Predictions) */}
      <PriceTicker
        rates={mandiRates}
        onSelectRate={(rate) => {
          setTickerSelectedRate(rate);
        }}
        currentLang={lang}
      />

      {/* 2. Top Header Navigation with Individual Login Profile */}
      <Header
        currentUser={currentUser}
        currentRole={role}
        onRoleChange={handleRoleChange}
        currentLang={lang}
        onLangChange={handleLangChange}
        currentTheme={theme}
        onThemeChange={setTheme}
        onOpenSellProduce={() => setIsSellModalOpen(true)}
        onOpenPostRequirement={() => setIsReqModalOpen(true)}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        pendingEnquiriesCount={pendingEnquiriesCount}
        unreadBidsCount={unreadBidsCount}
      />

      {/* 3. Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Main Body Content based on active role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {role === 'farmer' && (
          <FarmerView
            currentUser={currentUser}
            listings={listings}
            requirements={requirements}
            bids={bids}
            mandiRates={mandiRates}
            enquiries={enquiries}
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onInspectProduce={(listing) => setInspectingListing(listing)}
            onAcceptBid={handleAcceptBid}
            onCounterBid={handleCounterBid}
            onRejectBid={handleRejectBid}
            onRequestVendorEnquiry={(req) => {
              setEnquiryContext({
                targetId: req.vendorId,
                targetName: req.companyName,
                targetRole: 'vendor',
                referenceType: 'requirement',
                referenceId: req.id,
                referenceTitle: `${req.vegetableName} (${req.requiredQuantity} ${req.unit})`,
              });
            }}
            onApproveEnquiry={handleApproveEnquiry}
            onRejectEnquiry={handleRejectEnquiry}
            onSwitchUser={handleLogin}
            onOpenLoginModal={() => handleOpenLoginModal('farmer')}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            currentLang={lang}
          />
        )}

        {role === 'vendor' && (
          <VendorView
            currentUser={currentUser}
            listings={listings}
            requirements={requirements}
            bids={bids}
            mandiRates={mandiRates}
            enquiries={enquiries}
            onOpenRequirementModal={() => setIsReqModalOpen(true)}
            onInspectProduce={(listing) => setInspectingListing(listing)}
            onRequestFarmerEnquiry={(listing) => {
              setEnquiryContext({
                targetId: listing.farmerId,
                targetName: listing.farmerName,
                targetRole: 'farmer',
                referenceType: 'produce',
                referenceId: listing.id,
                referenceTitle: `${listing.vegetableName} (${listing.quantity} ${listing.unit})`,
              });
            }}
            onApproveEnquiry={handleApproveEnquiry}
            onRejectEnquiry={handleRejectEnquiry}
            onSwitchUser={handleLogin}
            onOpenLoginModal={() => handleOpenLoginModal('vendor')}
            currentLang={lang}
          />
        )}

        {role === 'apmc' && (
          <ApmcView
            currentUser={currentUser}
            mandiRates={mandiRates}
            gatePasses={gatePasses}
            onCreateGatePass={handleCreateGatePass}
            onViewGatePass={(pass) => setViewingGatePass(pass)}
            listings={listings}
            bids={bids}
            currentLang={lang}
          />
        )}
      </main>

      {/* 5. Modals */}
      <PostProduceModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmit={handleAddListing}
        mandiRates={mandiRates}
        currentUser={currentUser}
        currentLang={lang}
      />

      <PostRequirementModal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        onSubmit={handleAddRequirement}
        mandiRates={mandiRates}
        currentUser={currentUser}
        currentLang={lang}
      />

      <ProduceDetailModal
        listing={inspectingListing}
        isOpen={!!inspectingListing}
        onClose={() => setInspectingListing(null)}
        mandiRates={mandiRates}
        onPlaceBid={handlePlaceBid}
        onRequestEnquiry={(listing) => {
          setEnquiryContext({
            targetId: listing.farmerId,
            targetName: listing.farmerName,
            targetRole: 'farmer',
            referenceType: 'produce',
            referenceId: listing.id,
            referenceTitle: `${listing.vegetableName} (${listing.quantity} ${listing.unit})`,
          });
        }}
        enquiries={enquiries}
        currentUser={currentUser}
        currentRole={role}
        currentLang={lang}
      />

      <GatePassModal
        gatePass={viewingGatePass}
        isOpen={!!viewingGatePass}
        onClose={() => setViewingGatePass(null)}
        currentLang={lang}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentLang={lang}
        initialRole={loginTargetRole}
      />

      {enquiryContext && (
        <EnquiryModal
          isOpen={!!enquiryContext}
          onClose={() => setEnquiryContext(null)}
          currentUser={currentUser}
          targetId={enquiryContext.targetId}
          targetName={enquiryContext.targetName}
          targetRole={enquiryContext.targetRole}
          referenceType={enquiryContext.referenceType}
          referenceId={enquiryContext.referenceId}
          referenceTitle={enquiryContext.referenceTitle}
          onSubmitEnquiry={handleSendEnquiry}
          currentLang={lang}
        />
      )}

      {/* 7-Day Rate Prediction & 4-Factor Intelligence Modal */}
      <PredictionDetailModal
        rate={tickerSelectedRate}
        onClose={() => setTickerSelectedRate(null)}
        currentLang={lang}
      />

      {/* 2-Minute Playable Video Presentation Modal for Farmers */}
      <FarmerPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        currentLang={lang}
      />

      {/* 6. Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-stone-700">{t.appName}</span>
            <span>·</span>
            <span>APMC & e-NAM Integrated</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <span>{t.officialMandiFeed}</span>
            <span>·</span>
            <span>{t.privacyNotice}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
