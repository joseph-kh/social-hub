import { useLoader } from '@/contexts/LoaderContext'
import { useEmailAuth } from '@/hooks/useEmailAuth'
import { colors } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatePresence, MotiView } from 'moti'
import { useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

export default function EmailAuthView({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: (walletAddress: string) => void
}) {
  const [email, setEmail] = useState('')
  const [answer, setAnswer] = useState('')
  const [didSendAnswer, setDidSendAnswer] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isOtpFocused, setIsOtpFocused] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)

  const [panelOpen, setPanelOpen] = useState(true)
  const exitedAfterCloseRef = useRef(false)

  const inputRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)

  const DOT_COLORS = [colors.purple, colors.blue, colors.success]

  useEffect(() => {
    return () => {
      setEmail('')
      setAnswer('')
      setDidSendAnswer(false)
    }
  }, [])

  const { showLoader, hideLoader } = useLoader()

  const sessionName = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const {
    inProgress,
    initiateAuth,
    sendChallengeAnswer,
    cancel: cancelAuth,
    error: authError,
  } = useEmailAuth({
    sessionName,
    onSuccess: ({ wallet }) => {
      hideLoader()
      onSuccess(wallet)
    },
  })

  const handleExitComplete = () => {
    if (!exitedAfterCloseRef.current) return
    exitedAfterCloseRef.current = false
    cancelAuth()
    onCancel()
  }

  useEffect(() => {
    if (authError && didSendAnswer) {
      hideLoader()
      setDidSendAnswer(false)
      setAnswer('')
      setOtpError('Invalid code. Please check your email and try again.')
    }
  }, [authError, didSendAnswer, hideLoader])

  const handleClose = () => {
    exitedAfterCloseRef.current = true
    setPanelOpen(false)
  }

  const canSubmitEmail = /\S+@\S+\.\S+/.test(email)
  const canVerify = answer.length === 6
  const otpSlots = Array.from({ length: 6 }, (_, i) => answer[i] || '')

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {panelOpen && (
        <MotiView
          key="email-auth-shell"
          style={styles.overlay}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { type: 'timing', duration: 200 },
          }}
          exitTransition={{
            opacity: { type: 'timing', duration: 150 },
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.kavContainer}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.cardShell}
                transition={{
                  opacity: { type: 'timing', duration: 250 },
                  scale: {
                    type: 'spring',
                    damping: 8,
                    stiffness: 80,
                  },
                }}
              >
                <LinearGradient
                  colors={[colors.surface, colors.surfaceAlt]}
                  style={styles.card}
                >
                  <LinearGradient
                    colors={['transparent', colors.neonPurple, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.topAccent}
                  />

                  {!inProgress && !didSendAnswer && (
                    <>
                      <View style={styles.iconWrap}>
                        <Ionicons
                          name="mail-outline"
                          size={26}
                          color={colors.purple}
                        />
                      </View>
                      <Text style={styles.title}>Enter Your Email</Text>
                      <Text style={styles.subtitle}>
                        {"We'll send a 6-digit code to verify your identity."}
                      </Text>

                      <Pressable
                        onPress={() => emailRef.current?.focus()}
                        style={[
                          styles.inputWrap,
                          isEmailFocused && styles.inputFocused,
                        ]}
                      >
                        <Ionicons
                          name="at"
                          size={16}
                          color={
                            isEmailFocused
                              ? colors.purple
                              : colors.textSecondary
                          }
                          style={{ marginLeft: 4 }}
                        />
                        <TextInput
                          ref={emailRef}
                          autoFocus
                          autoCapitalize="none"
                          autoComplete="off"
                          keyboardType="email-address"
                          value={email}
                          onChangeText={setEmail}
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                          placeholder="you@example.com"
                          placeholderTextColor={colors.textSecondary}
                          style={styles.input}
                        />
                      </Pressable>

                      <View style={styles.btnRow}>
                        <Pressable
                          onPress={handleClose}
                          style={({ pressed }) => [
                            styles.btnGhost,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={styles.btnGhostText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => canSubmitEmail && initiateAuth(email)}
                          style={({ pressed }) => [
                            styles.btnPrimaryWrap,
                            pressed && styles.pressed,
                          ]}
                        >
                          <LinearGradient
                            colors={
                              canSubmitEmail
                                ? [colors.purple, '#6d28d9']
                                : [colors.surfaceAlt, colors.surfaceAlt]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.btnPrimary}
                          >
                            <Text
                              style={[
                                styles.btnPrimaryText,
                                !canSubmitEmail && {
                                  color: colors.textSecondary,
                                },
                              ]}
                            >
                              Continue
                            </Text>
                            <Ionicons
                              name="arrow-forward"
                              size={15}
                              color={
                                canSubmitEmail ? '#fff' : colors.textSecondary
                              }
                            />
                          </LinearGradient>
                        </Pressable>
                      </View>
                    </>
                  )}

                  {inProgress && !didSendAnswer && (
                    <>
                      <View
                        style={[
                          styles.iconWrap,
                          {
                            backgroundColor: 'rgba(32,227,138,0.1)',
                            borderColor: 'rgba(32,227,138,0.3)',
                          },
                        ]}
                      >
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={26}
                          color={colors.success}
                        />
                      </View>
                      <Text style={styles.title}>Verify Code</Text>
                      <Text style={styles.subtitle}>
                        Enter the 6-digit code sent to{'\n'}
                        <Text
                          style={{ color: colors.purple, fontWeight: '700' }}
                        >
                          {email}
                        </Text>
                      </Text>

                      <Pressable
                        onPress={() => inputRef.current?.focus()}
                        style={styles.otpRow}
                      >
                        {otpSlots.map((slot, i) => (
                          <View
                            key={i}
                            style={[
                              styles.otpBox,
                              isOtpFocused &&
                                i === answer.length &&
                                styles.otpBoxCursor,
                              slot ? styles.otpBoxFilled : null,
                            ]}
                          >
                            <Text style={styles.otpChar}>{slot}</Text>
                          </View>
                        ))}
                      </Pressable>

                      <TextInput
                        ref={inputRef}
                        autoFocus
                        autoComplete="off"
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        value={answer}
                        onFocus={() => setIsOtpFocused(true)}
                        onBlur={() => setIsOtpFocused(false)}
                        onChangeText={(v) => {
                          setOtpError(null)
                          setAnswer(v.replace(/[^0-9]/g, '').slice(0, 6))
                        }}
                        style={styles.hiddenInput}
                      />

                      {otpError && (
                        <View style={styles.errorBanner}>
                          <Ionicons
                            name="alert-circle-outline"
                            size={14}
                            color={colors.error}
                          />
                          <Text style={styles.errorBannerText}>{otpError}</Text>
                        </View>
                      )}

                      <View style={styles.btnRow}>
                        <Pressable
                          onPress={handleClose}
                          style={({ pressed }) => [
                            styles.btnGhost,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={styles.btnGhostText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            if (canVerify && sendChallengeAnswer) {
                              setDidSendAnswer(true)
                              showLoader('Verifying code...')
                              sendChallengeAnswer(answer)
                            }
                          }}
                          style={({ pressed }) => [
                            styles.btnPrimaryWrap,
                            canVerify && styles.verifyButtonActive,
                            pressed && styles.pressed,
                          ]}
                        >
                          <LinearGradient
                            colors={
                              canVerify
                                ? [colors.purple, '#6d28d9']
                                : [colors.surfaceAlt, colors.surfaceAlt]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.btnPrimary}
                          >
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={16}
                              color={canVerify ? '#fff' : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.btnPrimaryText,
                                !canVerify && { color: colors.textSecondary },
                              ]}
                            >
                              Verify
                            </Text>
                          </LinearGradient>
                        </Pressable>
                      </View>
                    </>
                  )}

                  {didSendAnswer && (
                    <View style={styles.loaderWrap}>
                      <View
                        style={[
                          styles.iconWrap,
                          {
                            backgroundColor: 'rgba(139,92,246,0.1)',
                            borderColor: 'rgba(139,92,246,0.3)',
                          },
                        ]}
                      >
                        <Ionicons
                          name="sparkles"
                          size={26}
                          color={colors.purple}
                        />
                      </View>
                      <Text style={styles.title}>Authenticating</Text>
                      <Text style={styles.subtitle}>
                        Connecting your wallet securely...
                      </Text>
                      <View style={styles.dots}>
                        {[0, 1, 2].map((i) => (
                          <MotiView
                            key={i}
                            style={[
                              styles.dot,
                              { backgroundColor: DOT_COLORS[i] },
                            ]}
                            from={{ opacity: 0.3 }}
                            animate={
                              didSendAnswer
                                ? { opacity: [0.3, 1, 0.3] }
                                : { opacity: 0.3 }
                            }
                            transition={
                              didSendAnswer
                                ? {
                                    opacity: {
                                      type: 'timing',
                                      duration: 600,
                                      loop: true,
                                      delay: i * 200,
                                    },
                                  }
                                : { type: 'timing', duration: 0 }
                            }
                          />
                        ))}
                      </View>
                    </View>
                  )}
                </LinearGradient>
              </MotiView>
            </ScrollView>
          </KeyboardAvoidingView>
        </MotiView>
      )}
    </AnimatePresence>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.88)',
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
    alignItems: 'center',
  },
  cardShell: {
    width: '92%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.15)',
    padding: 24,
    paddingTop: 28,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.purple,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: colors.purple,
    shadowColor: colors.neonPurple,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btnGhost: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  btnPrimaryWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  verifyButtonActive: {
    shadowColor: colors.neonPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  btnPrimary: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 16,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
    width: '100%',
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxCursor: {
    borderColor: colors.purple,
    shadowColor: colors.neonPurple,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  otpBoxFilled: {
    borderColor: colors.success,
    backgroundColor: 'rgba(32,227,138,0.07)',
  },
  otpChar: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    backgroundColor: 'rgba(255,93,115,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,93,115,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  loaderWrap: {
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
