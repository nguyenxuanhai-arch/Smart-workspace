package com.example.smartworkspace.components;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut for all methods in classes annotated with @Service
     */
    @Pointcut("within(@org.springframework.stereotype.Service *)")
    public void springBeanPointcut() {
        // Method is empty as this is just a Pointcut
    }

    /**
     * Pointcut for all methods in classes annotated with @RestController or @Controller
     */
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *) || within(@org.springframework.stereotype.Controller *)")
    public void springControllerPointcut() {
        // Method is empty as this is just a Pointcut
    }

    /**
     * Log details when a method in a service throws an exception.
     */
    @AfterThrowing(pointcut = "springBeanPointcut() || springControllerPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("Exception in {}.{}() with cause = {}", 
                  joinPoint.getSignature().getDeclaringTypeName(),
                  joinPoint.getSignature().getName(), 
                  e.getCause() != null ? e.getCause() : "NULL", e);
    }

    /**
     * Log entry and exit of methods in services and controllers.
     */
    @Around("springBeanPointcut() || springControllerPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        if (log.isInfoEnabled()) {
            log.info("Enter: {}.{}() with argument[s] = {}", 
                     joinPoint.getSignature().getDeclaringTypeName(),
                     joinPoint.getSignature().getName(), 
                     Arrays.toString(joinPoint.getArgs()));
        }
        
        try {
            long start = System.currentTimeMillis();
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - start;
            
            if (log.isInfoEnabled()) {
                log.info("Exit: {}.{}() with result = {}, Execution time = {} ms", 
                         joinPoint.getSignature().getDeclaringTypeName(),
                         joinPoint.getSignature().getName(), 
                         result, elapsedTime);
            }
            return result;
        } catch (IllegalArgumentException e) {
            log.error("Illegal argument: {} in {}.{}()", 
                      Arrays.toString(joinPoint.getArgs()),
                      joinPoint.getSignature().getDeclaringTypeName(), 
                      joinPoint.getSignature().getName());
            throw e;
        }
    }
}
