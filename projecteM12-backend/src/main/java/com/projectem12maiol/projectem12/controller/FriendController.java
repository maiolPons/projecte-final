    package com.projectem12maiol.projectem12.controller;

    import com.projectem12maiol.projectem12.model.Friend;
    import com.projectem12maiol.projectem12.model.User;
    import com.projectem12maiol.projectem12.repository.FriendRepository;
    import com.projectem12maiol.projectem12.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;


    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/friend")
    public class FriendController {
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private FriendRepository friendRepository;

        @PostMapping("/request/{receiverUsername}")
        public ResponseEntity<?> sendFriendRequest(@PathVariable String receiverUsername, @RequestBody Map<String, String> requestData) {

            String senderUsername = requestData.get("senderUsername");

            User sender = userRepository.findByUsername(senderUsername);
            User receiver = userRepository.findByUsername(receiverUsername);

            if (sender.getId().equals(receiver.getId())) {
                return ResponseEntity.badRequest().body("Cannot send friend request to yourself");
            }

            List<Friend> existingRequests = friendRepository.findBySenderAndReceiver(sender, receiver);
            if (!existingRequests.isEmpty()) {
                return ResponseEntity.badRequest().body("Friend request already sent to this user");
            }

            Friend friendRequest = new Friend();
            friendRequest.setSender(sender);
            friendRequest.setReceiver(receiver);
            friendRequest.setPending(true);

            friendRepository.save(friendRequest);

            return ResponseEntity.ok("Friend request sent");
        }
        @GetMapping("/pending")
        public ResponseEntity<List<Friend>> getPendingFriends(@RequestParam String username) {
            User currentUser = userRepository.findByUsername(username);
            List<Friend> pendingFriends = friendRepository.findByReceiverAndPending(currentUser, true);
            return ResponseEntity.ok(pendingFriends);
        }

        @GetMapping("/confirmed")
        public ResponseEntity<List<Friend>> getConfirmedFriends(@RequestParam String username) {
            User currentUser = userRepository.findByUsername(username);
            List<Friend> confirmedFriends = friendRepository.findBySenderOrReceiverAndPending(currentUser, currentUser, false);
            return ResponseEntity.ok(confirmedFriends);
        }
        @PutMapping("/{friendId}/accept")
        public ResponseEntity<?> acceptFriendRequest(@PathVariable Long friendId) {
            try {
                Friend friend = friendRepository.findById(friendId)
                        .orElseThrow(() -> new RuntimeException("Friend not found"));

                friend.setPending(false);
                Friend updatedFriend = friendRepository.save(friend);

                return ResponseEntity.ok(updatedFriend);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An error occurred while accepting the friend request");
            }
        }
        @DeleteMapping("/{friendId}")
        public ResponseEntity<?> cancelFriendRequest(@PathVariable Long friendId) {
            Friend friendRequest = friendRepository.findById(friendId)
                    .orElseThrow(() -> new RuntimeException("Friend request not found"));

            friendRepository.delete(friendRequest);

            return ResponseEntity.ok("Friend request cancelled");
        }


    }
