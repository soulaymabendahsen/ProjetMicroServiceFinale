package com.example.user.services;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {
    private static final int MAX_ATTEMPTS = 3;
    public static final long LOCK_TIME_DURATION = 15; // 15 minutes
    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        lockTimeCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0) + 1;
        attemptsCache.put(key, attempts);
        
        if (attempts >= MAX_ATTEMPTS) {
            lockTimeCache.put(key, System.currentTimeMillis());
        }
    }

    public boolean isBlocked(String key) {
        Long lockTime = lockTimeCache.get(key);
        if (lockTime == null) {
            return false;
        }

        if (System.currentTimeMillis() - lockTime > TimeUnit.MINUTES.toMillis(LOCK_TIME_DURATION)) {
            attemptsCache.remove(key);
            lockTimeCache.remove(key);
            return false;
        }

        return true;
    }

    public int getRemainingAttempts(String key) {
        return MAX_ATTEMPTS - attemptsCache.getOrDefault(key, 0);
    }

    public long getLockTimeRemaining(String key) {
        Long lockTime = lockTimeCache.get(key);
        if (lockTime == null) {
            return 0;
        }
        long timeRemaining = TimeUnit.MINUTES.toMillis(LOCK_TIME_DURATION) - 
                            (System.currentTimeMillis() - lockTime);
        return timeRemaining > 0 ? timeRemaining : 0;
    }
} 