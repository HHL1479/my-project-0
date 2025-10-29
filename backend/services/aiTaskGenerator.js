import OpenAI from 'openai';

class AITaskGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateTasksForGoal(goal, userPreferences = {}) {
    try {
      const prompt = this.buildPrompt(goal, userPreferences);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert life coach and productivity planner. Break down goals into actionable, specific tasks that can be scheduled. Each task should be concrete, measurable, and time-bounded."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      return this.parseTasksFromResponse(response);
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to rule-based task generation
      return this.generateFallbackTasks(goal);
    }
  }

  buildPrompt(goal, userPreferences) {
    const effortMap = {
      1: 'minimal (5-15 minutes daily)',
      2: 'light (15-30 minutes daily)',
      3: 'moderate (30-60 minutes daily)',
      4: 'significant (1-2 hours daily)',
      5: 'intensive (2+ hours daily)'
    };

    let prompt = `Break down this goal into actionable tasks:\n\n`;
    prompt += `Goal: "${goal.title}"\n`;
    
    if (goal.description) {
      prompt += `Description: "${goal.description}"\n`;
    }
    
    prompt += `Effort Level: ${effortMap[goal.effort] || 'moderate'}\n`;
    
    if (goal.targetDate) {
      const daysUntil = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      prompt += `Target Date: ${new Date(goal.targetDate).toLocaleDateString()} (${daysUntil} days from now)\n`;
    }
    
    if (goal.category) {
      prompt += `Category: ${goal.category}\n`;
    }

    prompt += `\nPlease provide:\n`;
    prompt += `1. Break this goal into 3-5 specific, actionable tasks\n`;
    prompt += `2. Each task should have a realistic duration (15 minutes to 4 hours)\n`;
    prompt += `3. Include a mix of one-time setup tasks and recurring activities\n`;
    prompt += `4. Make tasks specific and measurable\n`;
    prompt += `5. Consider the effort level and timeframe\n\n`;
    prompt += `Format your response as:\n`;
    prompt += `Task 1: [Title] - [Duration] - [Description]\n`;
    prompt += `Task 2: [Title] - [Duration] - [Description]\n`;
    prompt += `etc.`;

    return prompt;
  }

  parseTasksFromResponse(response) {
    const tasks = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const match = line.match(/^Task \d+:\s*(.+?)\s*-\s*(\d+)\s*(minutes?|hours?|hrs?)\s*-\s*(.+)$/i);
      if (match) {
        const [, title, duration, unit, description] = match;
        const durationMinutes = unit.toLowerCase().includes('hour') ? 
          parseInt(duration) * 60 : parseInt(duration);
        
        tasks.push({
          title: title.trim(),
          description: description.trim(),
          duration: durationMinutes,
          priority: 'medium'
        });
      }
    }
    
    return tasks.length > 0 ? tasks : null;
  }

  generateFallbackTasks(goal) {
    // Rule-based fallback for different categories
    const categoryTasks = {
      health: [
        { title: 'Research workout routines', description: 'Find 3-5 exercises that match your fitness level', duration: 30, priority: 'high' },
        { title: 'Plan weekly exercise schedule', description: 'Block out specific times for workouts this week', duration: 20, priority: 'high' },
        { title: 'Complete first workout session', description: 'Do a 30-minute workout following your planned routine', duration: 45, priority: 'medium' },
        { title: 'Track daily activity', description: 'Log your exercise and monitor progress', duration: 10, priority: 'low' },
        { title: 'Review and adjust fitness plan', description: 'Evaluate what worked and make improvements', duration: 20, priority: 'medium' }
      ],
      learning: [
        { title: 'Set up learning environment', description: 'Organize materials and create a dedicated study space', duration: 30, priority: 'high' },
        { title: 'Create learning schedule', description: 'Plan when and how long you will study each week', duration: 25, priority: 'high' },
        { title: 'Complete first study session', description: 'Begin with foundational concepts or first lesson', duration: 60, priority: 'medium' },
        { title: 'Practice and apply knowledge', description: 'Do exercises or projects to reinforce learning', duration: 45, priority: 'medium' },
        { title: 'Review progress and plan next steps', description: 'Assess understanding and adjust learning approach', duration: 20, priority: 'low' }
      ],
      career: [
        { title: 'Assess current skills and gaps', description: 'Identify what you need to develop for career growth', duration: 30, priority: 'high' },
        { title: 'Research industry requirements', description: 'Look up skills and qualifications needed in your field', duration: 45, priority: 'high' },
        { title: 'Update resume or portfolio', description: 'Refresh your professional materials with recent achievements', duration: 60, priority: 'medium' },
        { title: 'Network with industry professionals', description: 'Connect with 3-5 people in your field', duration: 30, priority: 'medium' },
        { title: 'Apply for new opportunities', description: 'Submit applications to 2-3 relevant positions', duration: 90, priority: 'low' }
      ]
    };

    const defaultTasks = [
      { title: 'Define specific objectives', description: 'Break down the goal into measurable outcomes', duration: 20, priority: 'high' },
      { title: 'Create action plan', description: 'Plan the steps needed to achieve your goal', duration: 30, priority: 'high' },
      { title: 'Set up tracking system', description: 'Choose how you will monitor progress', duration: 15, priority: 'medium' },
      { title: 'Take first action step', description: 'Begin with the most important task', duration: 45, priority: 'medium' },
      { title: 'Regular progress check', description: 'Review and adjust your approach weekly', duration: 20, priority: 'low' }
    ];

    return categoryTasks[goal.category] || defaultTasks;
  }

  async scheduleTasks(tasks, freeTimeSlots, userPreferences = {}) {
    const scheduledTasks = [];
    const usedSlots = [];

    // Sort tasks by priority and duration
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.duration - a.duration; // Longer tasks first
    });

    // Sort free time slots by duration (descending)
    const sortedSlots = freeTimeSlots.sort((a, b) => b.duration - a.duration);

    for (const task of sortedTasks) {
      // Find the best slot for this task
      const bestSlot = sortedSlots.find(slot => 
        slot.duration >= task.duration && 
        !usedSlots.includes(slot)
      );

      if (bestSlot) {
        scheduledTasks.push({
          ...task,
          scheduledDate: bestSlot.date,
          startTime: bestSlot.startTime,
          endTime: bestSlot.startTime + Math.ceil(task.duration / 60),
          slot: bestSlot
        });
        usedSlots.push(bestSlot);
      }
    }

    return scheduledTasks;
  }
}

export default new AITaskGenerator();