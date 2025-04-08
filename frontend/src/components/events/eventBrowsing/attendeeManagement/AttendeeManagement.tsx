import React, { useState, useEffect } from "react";
import { XMarkIcon, CheckIcon, UserGroupIcon } from "@heroicons/react/20/solid";
import { USER_ROLE } from "../../../../lib/types/Ticket";
import { User } from "../../../../lib/types/User";

interface ManageAttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  attendees: User[];
  sponsors: User[];
  onRemoveUsers: (userIds: string[], role: USER_ROLE) => Promise<boolean>;
}

const ManageAttendeesModal: React.FC<ManageAttendeesModalProps> = ({ 
  isOpen, 
  onClose, 
  eventId, 
  attendees, 
  sponsors, 
  onRemoveUsers 
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userType, setUserType] = useState<"attendees" | "sponsors">("attendees");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
    }
  }, [isOpen]);

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    const currentUsers = userType === "attendees" ? attendees : sponsors;
    if (selectedUsers.length === currentUsers.length) {
      // If all are selected, deselect all
      setSelectedUsers([]);
    } else {
      // Otherwise, select all
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const handleTabChange = (tab: "attendees" | "sponsors") => {
    setUserType(tab);
    setSelectedUsers([]);
  };

  const handleRemoveSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    console.log("Starting removal process with selected users:", selectedUsers);
    console.log("Current user type:", userType);
    console.log("Role being used:", userType === "attendees" ? USER_ROLE.ATTENDEE : USER_ROLE.SPONSOR);
    
    try {
      setIsProcessing(true);
      console.log("Calling onRemoveUsers with:", selectedUsers, userType === "attendees" ? USER_ROLE.ATTENDEE : USER_ROLE.SPONSOR);
      const success = await onRemoveUsers(selectedUsers, userType === "attendees" ? USER_ROLE.ATTENDEE : USER_ROLE.SPONSOR);
      console.log("onRemoveUsers result:", success);
      
      if (success) {
        // Clear selections
        setSelectedUsers([]);
        
        // Close and reopen the modal to refresh the UI with updated data
        onClose();
      }
    } catch (error) {
      console.error("Detailed error when removing users:", error);
      
      // Check if error is an AxiosError
      if (error && typeof error === 'object' && 'response' in error) {
        console.error("API response details:", error.response);
      }
      
      alert("Failed to remove users. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render user card
  const renderUserCard = (user: User) => {
    const isSelected = selectedUsers.includes(user.id);
    
    return (
      <div 
        key={user.id}
        className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow border-2 ${
          isSelected ? "border-blue-500" : "border-transparent"
        } transition-colors cursor-pointer`}
        onClick={() => handleSelectUser(user.id)}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
              isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}>
              {isSelected && <CheckIcon className="h-4 w-4 text-blue-500" />}
            </div>
          </div>
          
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt={user.userType === "individual" ? `${user.firstName} ${user.lastName}` : user.organizationName}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          
          <div>
            {user.userType === "individual" ? (
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {user.firstName} {user.lastName}
                </h3>
                {user.profession && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.profession}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {user.organizationName}
                </h3>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const currentUsers = userType === "attendees" ? attendees : sponsors;
  const hasSelectedAll = selectedUsers.length === currentUsers.length && currentUsers.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            Manage Event Participants
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange("attendees")}
              className={`py-4 px-6 font-medium text-sm ${
                userType === "attendees"
                  ? "border-b-2 border-[#49475B] text-[#49475B] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Attendees ({attendees.length})
            </button>
            <button
              onClick={() => handleTabChange("sponsors")}
              className={`py-4 px-6 font-medium text-sm ${
                userType === "sponsors"
                  ? "border-b-2 border-[#49475B] text-[#49475B] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Sponsors ({sponsors.length})
            </button>
          </nav>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleSelectAll}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                hasSelectedAll
                  ? "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              } border border-gray-300 dark:border-gray-600 mr-2 hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              {hasSelectedAll ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUsers.length} selected
            </span>
          </div>
          
          <button
            onClick={handleRemoveSelected}
            disabled={selectedUsers.length === 0 || isProcessing}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedUsers.length === 0 || isProcessing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Remove Selected ${userType === "attendees" ? "Attendees" : "Sponsors"}`
            )}
          </button>
        </div>

        {/* List of Users */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {currentUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No {userType} found for this event.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUsers.map(renderUserCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAttendeesModal;