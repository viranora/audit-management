package com.example.smartspiritbackend.aspect;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Sadece method'lara uygulanabilir
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckStatus {
    // İzin verilen status değeri
    String value() default "Active";
}