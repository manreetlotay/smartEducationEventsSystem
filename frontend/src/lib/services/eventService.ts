// lib/services/eventService.ts
import axios from 'axios';
import { USER_ROLE } from '../types/Ticket';
import { User } from '../types/User';

const API_BASE_URL = 'http://localhost:8000';

interface RemoveUsersResponse {
  message: string;
  removed_count: number;
}

export const removeUsersFromEvent = async (
  eventId: string, 
  userIds: string[], 
  role: USER_ROLE
): Promise<RemoveUsersResponse> => {
  try {
    console.log("eventService: Making API call to remove users from event:", eventId);
    console.log("eventService: Removing userIds:", userIds);
    console.log("eventService: With role:", role);
    
    const response = await axios.post<RemoveUsersResponse>(
      `${API_BASE_URL}/events/${eventId}/remove-users`, 
      {
        userIds,
        role
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if your API requires authentication
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    console.log("eventService: API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('eventService: Error removing users from event:', error);
    
    // Additional logging for axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      console.error("eventService: API error details:", error.response);
    }
    
    throw error;
  }
};

export const getEventAttendees = async (eventId: string): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/events/${eventId}/attendees`, {
      headers: {
        // Include auth token if your API requires authentication
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    throw error;
  }
};

export const getEventSponsors = async (eventId: string): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/events/${eventId}/sponsors`, {
      headers: {
        // Include auth token if your API requires authentication
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching event sponsors:', error);
    throw error;
  }
};